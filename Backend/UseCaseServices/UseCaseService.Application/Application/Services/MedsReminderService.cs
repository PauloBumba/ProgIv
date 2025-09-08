using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
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

        public MedsReminderService(IServiceScopeFactory scopeFactory, ILogger<MedsReminderService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
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
                    var currentTime = now.TimeOfDay;

                    // Busca todos os schedules habilitados com include da medication
                    var allSchedules = await db.MedicationSchedules
                        .Include(s => s.Medication)
                        .Where(s => s.Enabled)
                        .ToListAsync(stoppingToken);

                    foreach (var schedule in allSchedules)
                    {
                        // Calcula o horário programado para hoje
                        var scheduledTimeToday = now.Date.Add(schedule.TimeOfDay);
                        var timeDifference = (now - scheduledTimeToday).Duration();

                        // Verifica se está dentro da janela de 60 segundos
                        if (timeDifference <= TimeSpan.FromSeconds(60))
                        {
                            _logger.LogInformation("Lembrete para {Medication} às {Time}",
                                schedule.Medication.Name, schedule.TimeOfDay);

                            // Verifica se já não foi registrado hoje para evitar duplicatas
                            var alreadyNotifiedToday = await db.MedicationHistories
                                .AnyAsync(h => h.MedicationId == schedule.MedicationId &&
                                              h.CreatedAt.Date == now.Date &&
                                              h.Note != null &&
                                              h.Note.Contains("Lembrete enviado"),
                                          stoppingToken);

                            if (!alreadyNotifiedToday)
                            {
                                // Cria registro de histórico para o lembrete
                                var history = new MedicationHistory
                                {
                                    Id = Guid.NewGuid(),
                                    MedicationId = schedule.MedicationId,
                                    TakenAt = null, // Não foi tomado ainda, apenas lembrado
                                    WasTaken = false, // Ainda não foi tomado
                                    Note = $"Lembrete enviado para {schedule.Medication.Name} às {schedule.TimeOfDay}",
                                    CreatedAt = now
                                };

                                db.MedicationHistories.Add(history);
                                await db.SaveChangesAsync(stoppingToken);

                                _logger.LogInformation("Lembrete registrado para {Medication}",
                                    schedule.Medication.Name);
                            }
                            else
                            {
                                _logger.LogInformation("Lembrete já enviado hoje para {Medication}",
                                    schedule.Medication.Name);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro no serviço de lembretes");
                }

                // Aguarda 30 segundos antes da próxima verificação
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}