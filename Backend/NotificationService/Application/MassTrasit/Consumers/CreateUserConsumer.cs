using MassTransit;
using Shared.Contracts.Events;
using Application.Interface;
using Infrastruture.Interface;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Application.MassTransit.Consumers
{
    public class CreateUserConsumer : IConsumer<CreateUserEvents>
    {
        private readonly IEmailService _sendEmail;
        private readonly ISignalRNotificationService _signalRNotificationService;
        private readonly ILogger<CreateUserConsumer> _logger;

        public CreateUserConsumer(
            IEmailService sendEmail,
            ISignalRNotificationService signalRNotificationService,
            ILogger<CreateUserConsumer> logger)
        {
            _sendEmail = sendEmail ?? throw new ArgumentNullException(nameof(sendEmail));
            _signalRNotificationService = signalRNotificationService ?? throw new ArgumentNullException(nameof(signalRNotificationService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task Consume(ConsumeContext<CreateUserEvents> context)
        {
            var evt = context.Message;

            // Validação básica do evento
            if (string.IsNullOrWhiteSpace(evt.Email) || string.IsNullOrWhiteSpace(evt.FullName))
            {
                _logger.LogError("Evento CreateUserEvents inválido: Email ou FullName estão vazios.");
                throw new ArgumentException("Email e FullName não podem ser vazios.");
            }

            _logger.LogInformation("Consumindo CreateUserEvents para {Email}, Role: {Role}", evt.Email, evt.Role);

            // Monta o corpo do e-mail
            string body = $@"
                <html>
                <body>
                    <p>Olá, {evt.FullName}</p>
                    <p>Usuário Criado!</p>
                    <h2>{evt.CreateTime:dd/MM/yyyy HH:mm}</h2>
                    <p>Se não foi você, ignore este e-mail.</p>
                </body>
                </html>";

            // Envia o e-mail
            try
            {
                await _sendEmail.SendEmailAsync(evt.Email, "Bem-vindo à plataforma", body);
                _logger.LogInformation("E-mail enviado com sucesso para {Email}", evt.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail para {Email}, Role: {Role}", evt.Email, evt.Role);
            }

            // Notifica administradores via SignalR
            const string notificationMessage = "Novo usuário criado: {0} ({1})";
            try
            {
                await _signalRNotificationService.NotifyAdminsAsync(string.Format(notificationMessage, evt.FullName, evt.Email));
                _logger.LogInformation("Notificação SignalR enviada com sucesso para {Email}", evt.Email);
                Console.WriteLine("Notificação SignalR enviada com sucesso!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao notificar via SignalR para {Email}, Role: {Role}", evt.Email, evt.Role);
                Console.WriteLine($"Erro ao enviar notificação SignalR: {ex.Message}");
            }
        }
    }
}