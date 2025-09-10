using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public class ScheduleCreatedEvent
    {
        public Guid ScheduleId { get; set; }
        public Guid MedicationId { get; set; }
        public TimeSpan TimeOfDay { get; set; }
        public bool Enabled { get; set; }
    }
}
