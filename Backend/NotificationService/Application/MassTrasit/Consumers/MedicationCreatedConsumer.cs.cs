using Application.Helper; // SafeExecutor
using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;

using System.Threading.Tasks;

namespace Application.MassTransit.Consumers
{
    public class MedicationCreatedConsumer : IConsumer<MedicationCreatedEvent>
    {
        private readonly IEmailService _email;
        private readonly ISignalRNotificationService _signalR;
        private readonly ILogger<MedicationCreatedConsumer> _logger;

        public MedicationCreatedConsumer(
            IEmailService email,
            ISignalRNotificationService signalR,
            ILogger<MedicationCreatedConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationCreatedEvent> context)
        {
            var evt = context.Message;

            // HTML para e-mail
            var content = $@"
                <h2>💊 Nova Medicação Criada</h2>
                <p>Uma nova medicação foi registrada no sistema:</p>
                <p class='highlight'><strong>{evt.Name}</strong> ({evt.Strength})</p>
            ";

            var htmlMessage = EmailTemplateBase.Wrap("Nova Medicação", content);

            // Texto simples para SignalR
            var signalrMessage = $"💊 Nova medicação criada: {evt.Name} ({evt.Strength})";

            // Envio do e-mail
            await SafeExecutor.ExecuteAsync(
                () => _email.SendEmailAsync(evt.Email, "💊 Medicação criada", htmlMessage),
                _logger,
                "Erro ao enviar e-mail da medicação"
            );

            // Notificação em tempo real via SignalR
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyUserAsync(evt.UserId, signalrMessage),
                _logger,
                "Erro ao enviar notificação SignalR ao usuário"
            );

            // Opcional: notificar admins também
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyAdminsAsync(signalrMessage),
                _logger,
                "Erro ao enviar notificação SignalR para admins"
            );
        }
    }
}
