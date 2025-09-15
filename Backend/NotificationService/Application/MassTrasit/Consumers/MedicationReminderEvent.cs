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

        public MedicationReminderConsumer(
            IEmailService email,
            ISignalRNotificationService signalR,
            ILogger<MedicationReminderConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationReminderEvent> context)
        {
            var evt = context.Message;

            // HTML para e-mail
            var content = $@"
                <h2>⏰ Lembrete de Medicação</h2>
                <p>Olá,</p>
                <p>Está na hora de tomar a medicação:</p>
                <p class='highlight'><strong>{evt.MedicationName}</strong></p>
                <p>Horário do lembrete: <strong>{evt.TimeOfReminder:dd/MM/yyyy HH:mm}</strong></p>
            ";

            var htmlMessage = EmailTemplateBase.Wrap("Lembrete de Medicação", content);

            // Texto simples para notificações via SignalR
            var signalrMessage = $"⏰ Lembrete: tome sua medicação {evt.MedicationName} às {evt.TimeOfReminder:g}";

            // Envio seguro com logs
            await SafeExecutor.ExecuteAsync(
                () => _email.SendEmailAsync(evt.Email, "⏰ Lembrete de medicação", htmlMessage),
                _logger, "Erro ao enviar e-mail");

            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyUserAsync(evt.UserId, signalrMessage),
                _logger, "Erro ao enviar notificação SignalR");

            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyAdminsAsync(signalrMessage),
                _logger, "Erro ao enviar notificação SignalR");
        }
    }
}
