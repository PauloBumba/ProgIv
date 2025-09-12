using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class MedicationSchedule
    {
        public Guid Id { get; set; }
        public Guid MedicationId { get; set; }
        public Medication? Medication { get; set; } 
        public TimeSpan TimeOfDay { get; set; } // horário diário
        public int RepeatIntervalDays { get; set; } = 1; 
        public bool Enabled { get; set; } = true;
       
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public ICollection<MedicationHistory> Histories { get; set; } = new List<MedicationHistory>();

        public string UserId { get; set; } = string.Empty;
        public UserEntities? User { get; set; }

    }
}
