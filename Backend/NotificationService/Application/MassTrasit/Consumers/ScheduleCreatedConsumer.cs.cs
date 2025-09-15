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

        public MedicationScheduleCreatedConsumer(
            IEmailService email,
            ISignalRNotificationService signalR,
            ILogger<MedicationScheduleCreatedConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<MedicationScheduleCreatedEvent> context)
        {
            var evt = context.Message;

            // HTML para e-mail
            var content = $@"
                <h2>📅 Novo Agendamento Criado</h2>
                <p>Foi adicionado um novo horário para a medicação:</p>
                <p class='highlight'><strong>{evt.MedicationId}</strong></p>
                <p>Horário do agendamento: <strong>{evt.TimeOfDay:hh\\:mm}</strong></p>
            ";

            var htmlMessage = EmailTemplateBase.Wrap("Novo Agendamento de Medicação", content);

            // Texto simples para SignalR
            var signalrMessage = $"📅 Novo schedule criado para a medicação {evt.MedicationId} às {evt.TimeOfDay}";

            // Envio de e-mail
            await SafeExecutor.ExecuteAsync(
                () => _email.SendEmailAsync(evt.Email, "📅 Novo agendamento de medicação", htmlMessage),
                _logger, "Erro ao enviar e-mail"
            );

            // Notificação em tempo real ao usuário
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyUserAsync(evt.UserId, signalrMessage),
                _logger, "Erro ao enviar notificação SignalR"
            );

            // Notificação para admins
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyAdminsAsync(signalrMessage),
                _logger, "Erro ao enviar notificação SignalR"
            );
        }
    }
}
