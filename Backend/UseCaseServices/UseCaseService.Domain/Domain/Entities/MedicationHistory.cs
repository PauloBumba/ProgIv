using System;

namespace Domain.Entities
{
    public class MedicationHistory
    {
        public long Id { get; set; }
        public long MedicationId { get; set; } // Atualizado de Guid para long
        public Medication? Medication { get; set; }

        public long ScheduleId { get; set; }   // Relaciona com o schedule
        public MedicationSchedule? Schedule { get; set; }

        public bool WasTaken { get; set; } = false;
        public DateTime? TakenAt { get; set; }

        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
