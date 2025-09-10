using MassTransit;
using Shared.Contracts.Events;
using Application.Interface;
using Infrastruture.Interface;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Application.MassTrasit.Consumers
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
            string message = $"Nova medicação criada: {evt.Name} ({evt.Strength})";

            try { await _email.SendEmailAsync("paulomvbumba@gmail.com", "Medicação criada", message); }
            catch (Exception ex) { _logger.LogError(ex, "Erro ao enviar e-mail"); }

            try { await _signalR.NotifyAdminsAsync(message); }
            catch (Exception ex) { _logger.LogError(ex, "Erro SignalR"); }
        }
    }
}
