using Shared.Contracts.Events;
using Infrastruture.Interface;
using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interface;
namespace Application.MassTrasit.Consumers
{
    public class PasswordRecoveryRequestedConsumer : IConsumer<PasswordRecoveryRequestedEvent>
    {
        private readonly IEmailService _sendEmail;
        private readonly ISignalRNotificationService _signalRNotificationService;

        public PasswordRecoveryRequestedConsumer(IEmailService sendEmail, ISignalRNotificationService signalRNotificationService)
        {
            _signalRNotificationService = signalRNotificationService;
            _sendEmail = sendEmail;
        }

        public async Task Consume(ConsumeContext<PasswordRecoveryRequestedEvent> context)
        {
            var evt = context.Message;

            string body = $@"
            <html>
            <body>
                <p>Olá, {evt.FullName}</p>
                <p>Use esse código para recuperar sua senha:</p>
                <h2>{evt.Code}</h2>
                <p>Se não foi você, ignore.</p>
            </body>
            </html>";

            await _sendEmail.SendEmailAsync(evt.Email, "Recuperação de senha", body);

            // Notifica admins
            await _signalRNotificationService.NotifyAdminsAsync($"Password recovery solicitado para {evt.Email} em {evt.CreateTime}. Código: {evt.Code}");
        }
    }



}
