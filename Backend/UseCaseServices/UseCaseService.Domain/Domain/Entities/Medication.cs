using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Medication
    {
        public long Id { get; set; } // Modificado de Guid para long
        public string Name { get; set; } = null!;
        public string Strength { get; set; } = null!;
        public string Notes { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<MedicationSchedule> Schedules { get; set; } = new List<MedicationSchedule>();
        public ICollection<MedicationHistory> History { get; set; } = new List<MedicationHistory>();

        public string UserId { get; set; } = string.Empty;
        public virtual UserEntities? User { get; set; }
    }
}

