using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Medication
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Strength { get; set; } = null!; // ex: "500 mg"
        public string Notes { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<MedicationSchedule> Schedules { get; set; } = new List<MedicationSchedule>();
        public ICollection<MedicationHistory> History { get; set; } = new List<MedicationHistory>();

        public string UserId { get; set; } = string.Empty;
        public virtual UserEntities? User { get; set; }
    }
}

