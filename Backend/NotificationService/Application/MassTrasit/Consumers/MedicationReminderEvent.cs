using Application.Helper;

using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;
using System.Threading.Tasks;

namespace Application.MassTransit.Consumers
{
    public class MedicationReminderConsumer : IConsumer<MedicationReminderEvent>
    {
        private readonly IEmailService _email;
        private readonly ISignalRNotificationService _signalR;
        private readonly ILogger<MedicationReminderConsumer> _logger;

        public MedicationReminderConsumer(IEmailService email, ISignalRNotificationService signalR, ILogger<MedicationReminderConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationReminderEvent> context)
        {
            var evt = context.Message;
            string message = $"⏰ Lembrete: tome sua medicação {evt.MedicationName} às {evt.TimeOfReminder:g}";

            await SafeExecutor.ExecuteAsync(() => _email.SendEmailAsync(evt.Email, "Lembrete de medicação", message), _logger, "Erro ao enviar e-mail");
            await SafeExecutor.ExecuteAsync(() => _signalR.NotifyUserAsync(evt.UserId, message), _logger, "Erro ao enviar notificação SignalR");
            await SafeExecutor.ExecuteAsync(() => _signalR.NotifyAdminsAsync(message), _logger, "Erro ao enviar notificação SignalR");
        }
    }
}
