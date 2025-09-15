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

        public MedicationCreatedConsumer(IEmailService email, ISignalRNotificationService signalR, ILogger<MedicationCreatedConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationCreatedEvent> context)
        {
            var evt = context.Message;
            string message = $"💊 Nova medicação criada: {evt.Name} ({evt.Strength})";

            // Envia email para o usuário
            await SafeExecutor.ExecuteAsync(
                () => _email.SendEmailAsync(evt.Email, "Medicação criada", message),
                _logger,
                "Erro ao enviar e-mail da medicação"
            );

            // Notificação em tempo real via SignalR
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyUserAsync(evt.UserId, message),
                _logger,
                "Erro ao enviar notificação SignalR ao usuário"
            );

            // Opcional: notificar admins também
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyAdminsAsync(message),
                _logger,
                "Erro ao enviar notificação SignalR para admins"
            );
        }
    }
}
