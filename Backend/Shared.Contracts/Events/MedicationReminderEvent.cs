using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public record MedicationReminderEvent
    {
        public long MedicationId { get; init; }
        public long ScheduleId { get; init; }
        public string UserId { get; init; } = string.Empty;
        public DateTime TimeOfReminder { get; init; }
        public string MedicationName { get; init; } = string.Empty;
        public string? Email { get; set; }

    }
}
