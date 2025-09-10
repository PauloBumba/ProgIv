using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public class MedicationCreatedEvent
    {
        public Guid MedicationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Strength { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }
}
