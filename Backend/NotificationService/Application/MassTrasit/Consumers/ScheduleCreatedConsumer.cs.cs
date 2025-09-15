using Application.Helper;

using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;
using System.Threading.Tasks;

namespace Application.MassTransit.Consumers
{
    public class MedicationScheduleCreatedConsumer : IConsumer<MedicationScheduleCreatedEvent>
    {
        private readonly IEmailService _email;
        private readonly ISignalRNotificationService _signalR;
        private readonly ILogger<MedicationScheduleCreatedConsumer> _logger;

        public MedicationScheduleCreatedConsumer(IEmailService email, ISignalRNotificationService signalR, ILogger<MedicationScheduleCreatedConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationScheduleCreatedEvent> context)
        {
            var evt = context.Message;
            string message = $"📅 Novo schedule criado para a medicação {evt.MedicationId} às {evt.TimeOfDay}";

            await SafeExecutor.ExecuteAsync(() => _email.SendEmailAsync(evt.Email, "Novo schedule de medicação", message), _logger, "Erro ao enviar e-mail");
            await SafeExecutor.ExecuteAsync(() => _signalR.NotifyUserAsync(evt.UserId, message), _logger, "Erro ao enviar notificação SignalR");
            await SafeExecutor.ExecuteAsync(() => _signalR.NotifyAdminsAsync( message), _logger, "Erro ao enviar notificação SignalR");
        }
    }
}
