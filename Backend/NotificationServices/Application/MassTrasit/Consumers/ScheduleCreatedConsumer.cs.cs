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
    public class ScheduleCreatedConsumer : IConsumer<ScheduleCreatedEvent>
    {
        private readonly IEmailService _email;
        private readonly ISignalRNotificationService _signalR;
        private readonly ILogger<ScheduleCreatedConsumer> _logger;

        public ScheduleCreatedConsumer(IEmailService email, ISignalRNotificationService signalR, ILogger<ScheduleCreatedConsumer> logger)
        {
            _email = email;
            _signalR = signalR;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<ScheduleCreatedEvent> context)
        {
            var evt = context.Message;
            string message = $"Novo horário criado para medicação {evt.MedicationId} às {evt.TimeOfDay:HH:mm}";

            try { await _email.SendEmailAsync("admin@pharma.com", "Novo horário de medicação", message); }
            catch (Exception ex) { _logger.LogError(ex, "Erro ao enviar e-mail"); }

            try { await _signalR.NotifyAdminsAsync(message); }
            catch (Exception ex) { _logger.LogError(ex, "Erro SignalR"); }
        }
    }
}
