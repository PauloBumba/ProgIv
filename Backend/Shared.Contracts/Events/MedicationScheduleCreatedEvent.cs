using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public class MedicationScheduleCreatedEvent
    {
        public long ScheduleId { get; set; }
        public long MedicationId { get; set; }
        public TimeSpan TimeOfDay { get; set; }
        public int RepeatIntervalDays { get; set; }
        public bool Enabled { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Email { get; set; }
        public string UserId { get; set; } = string.Empty;
    }

}
