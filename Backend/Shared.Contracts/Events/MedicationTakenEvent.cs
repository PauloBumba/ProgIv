using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public class MedicationTakenEvent
    {
        public long MedicationId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime TakenAt { get; set; } = DateTime.UtcNow;
        public string? Email { get; set; }
    }
}
