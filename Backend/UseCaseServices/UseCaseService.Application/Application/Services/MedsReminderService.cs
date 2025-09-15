using Domain.Entities;
using Infrastructure.Persistence;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class MedsReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MedsReminderService> _logger;
        private readonly IPublishEndpoint _publish;
        private readonly IUserContextService _userContextService;
        public MedsReminderService(IServiceScopeFactory scopeFactory, ILogger<MedsReminderService> logger, IPublishEndpoint publish , IUserContextService userContextService)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _publish = publish;
            _userContextService = userContextService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MedsReminderService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<UserCaseDbContext>();
                    var now = DateTime.UtcNow;

                    // Busca todos os schedules habilitados
                    var allSchedules = await db.MedicationSchedules
                        .Include(s => s.Medication)
                        .Where(s => s.Enabled)
                        .ToListAsync(stoppingToken);

                    foreach (var schedule in allSchedules)
                    {
                        var scheduledTimeToday = now.Date.Add(schedule.TimeOfDay);
                        var timeDifference = (now - scheduledTimeToday).Duration();

                        // Dentro da janela de 60 segundos
                        if (timeDifference <= TimeSpan.FromSeconds(60))
                        {
                            _logger.LogInformation("Lembrete para {Medication} às {Time}", schedule.Medication.Name, schedule.TimeOfDay);

                            var alreadyNotifiedToday = await db.MedicationHistories
                                .AnyAsync(h => h.MedicationId == schedule.MedicationId &&
                                              h.Notes != null &&
                                              h.Notes.Contains("Lembrete enviado") &&
                                              h.TakenAt == null, stoppingToken);

                            if (!alreadyNotifiedToday)
                            {
                                // Cria registro de histórico
                                var history = new MedicationHistory
                                {
                                   
                                    MedicationId = schedule.MedicationId,
                                    ScheduleId = schedule.Id,
                                    WasTaken = false,
                                    TakenAt = null,
                                    Notes = $"Lembrete enviado para {schedule.Medication.Name} às {schedule.TimeOfDay}"
                                };

                                db.MedicationHistories.Add(history);
                                await db.SaveChangesAsync(stoppingToken);

                                _logger.LogInformation("Lembrete registrado no banco para {Medication}", schedule.Medication.Name);

                                // ✅ Publica evento no RabbitMQ via MassTransit
                                await _publish.Publish(new MedicationReminderEvent
                                {
                                    MedicationId = schedule.MedicationId,
                                    ScheduleId = schedule.Id,
                                   
                                    TimeOfReminder = now,
                                    MedicationName = schedule.Medication.Name,
                                    Email= _userContextService.GetUserEmail(),
                                    UserId=_userContextService.GetUserId()
                                }, stoppingToken);

                                _logger.LogInformation("Evento enviado para RabbitMQ para {Medication}", schedule.Medication.Name);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro no serviço de lembretes");
                }

                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }

    
}
