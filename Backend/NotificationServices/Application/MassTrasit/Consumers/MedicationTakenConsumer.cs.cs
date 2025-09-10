using Application.Interface;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.MassTrasit.Consumers
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
            string message = $"Medicação {evt.MedicationId} tomada em {evt.TakenAt:HH:mm} pelo usuário {evt.UserId}";

            try { await _email.SendEmailAsync("admin@pharma.com", "Medicação tomada", message); }
            catch (Exception ex) { _logger.LogError(ex, "Erro ao enviar e-mail"); }

            try { await _signalR.NotifyAdminsAsync(message); }
            catch (Exception ex) { _logger.LogError(ex, "Erro SignalR"); }
        }
    }

}
