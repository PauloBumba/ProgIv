using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class MedicationHistory
    {
        public Guid Id { get; set; }
        public Guid MedicationId { get; set; }
        public Medication Medication { get; set; } = null!;
        public DateTime? TakenAt { get; set; } // Alterado para nullable (quando é apenas lembrete)
        public bool WasTaken { get; set; } = true;
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Adicionado para controle
    }
}
