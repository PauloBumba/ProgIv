using Application.Helper;
using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;

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

            _logger.LogInformation("Consumindo CreateUserEvents para {Email}, Role: {Role}", evt.Email);

            // HTML estilizado para e-mail
            var content = $@"
                <p>Olá, <strong>{evt.FullName}</strong></p>
                <p>Seu usuário foi criado com sucesso!</p>
                <p class='highlight'>{evt.CreateTime:dd/MM/yyyy HH:mm}</p>
                <p>Se não foi você, ignore este e-mail.</p>
            ";

            var htmlBody = EmailTemplateBase.Wrap("🎉 Usuário Criado", content);

            // Envia o e-mail
            try
            {
                await _sendEmail.SendEmailAsync(evt.Email, "🎉 Bem-vindo à plataforma", htmlBody);
                _logger.LogInformation("E-mail enviado com sucesso para {Email}", evt.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail para {Email}, Role: {Role}", evt.Email);
            }

            // Notificação simples para admins via SignalR
            var notificationMessage = $"👤 Novo usuário criado: {evt.FullName} ({evt.Email})";
            try
            {
                await _signalRNotificationService.NotifyAdminsAsync(notificationMessage);
                _logger.LogInformation("Notificação SignalR enviada com sucesso para {Email}", evt.Email);
                Console.WriteLine("Notificação SignalR enviada com sucesso!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao notificar via SignalR para {Email}, Role: {Role}", evt.Email);
                Console.WriteLine($"Erro ao enviar notificação SignalR: {ex.Message}");
            }
        }
    }
}
