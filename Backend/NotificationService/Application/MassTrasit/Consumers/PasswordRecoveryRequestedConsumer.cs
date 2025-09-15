using Application.Helper;
using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;
using System.Threading.Tasks;

namespace Application.MassTransit.Consumers
{
    public class PasswordRecoveryRequestedConsumer : IConsumer<PasswordRecoveryRequestedEvent>
    {
        private readonly IEmailService _email;
        private readonly ISignalRNotificationService _signalR;
        private readonly ILogger<PasswordRecoveryRequestedConsumer> _logger;

        public PasswordRecoveryRequestedConsumer(
            IEmailService email,
            ISignalRNotificationService signalR,
            ILogger<PasswordRecoveryRequestedConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<PasswordRecoveryRequestedEvent> context)
        {
            var evt = context.Message;

            var content = $@"
                <p>Olá, {evt.FullName}</p>
                <p>Use esse código para recuperar sua senha:</p>
                <h2>{evt.Code}</h2>
                <p>Se não foi você, ignore.</p>
            ";

            var htmlMessage = EmailTemplateBase.Wrap("Recuperação de senha", content);
            var signalrMessage = $"Password recovery solicitado para {evt.Email} em {evt.CreateTime}. Código: {evt.Code}";

            // Envio seguro do e-mail
            await SafeExecutor.ExecuteAsync(
                () => _email.SendEmailAsync(evt.Email, "Recuperação de senha", htmlMessage),
                _logger,
                "Erro ao enviar e-mail de recuperação de senha"
            );

            // Notificação via SignalR para admins
            await SafeExecutor.ExecuteAsync(
                () => _signalR.NotifyAdminsAsync(signalrMessage),
                _logger,
                "Erro ao notificar admins sobre recuperação de senha"
            );
        }
    }
}
