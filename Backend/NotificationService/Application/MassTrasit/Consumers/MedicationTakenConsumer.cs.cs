using Application.Helper;
using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;
using System.Threading.Tasks;

namespace Application.MassTransit.Consumers
{
    public class MedicationTakenConsumer : IConsumer<MedicationTakenEvent>
    {
        private readonly IEmailService _email;
        private readonly ISignalRNotificationService _signalR;
        private readonly ILogger<MedicationTakenConsumer> _logger;

        public MedicationTakenConsumer(IEmailService email, ISignalRNotificationService signalR, ILogger<MedicationTakenConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationTakenEvent> context)
        {
            var evt = context.Message;
            string message = $"💊 Medicação {evt.MedicationId} marcada como tomada em {evt.TakenAt:g}";

            await SafeExecutor.ExecuteAsync(() => _email.SendEmailAsync(evt.Email, "Medicação tomada", message), _logger, "Erro ao enviar e-mail");
            await SafeExecutor.ExecuteAsync(() => _signalR.NotifyUserAsync(evt.UserId, message), _logger, "Erro ao enviar notificação SignalR");
            await SafeExecutor.ExecuteAsync(() => _signalR.NotifyAdminsAsync(message), _logger, "Erro ao enviar notificação SignalR");
        }
    }
}
