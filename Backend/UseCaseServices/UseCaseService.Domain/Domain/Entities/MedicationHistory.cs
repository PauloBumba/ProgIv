using System;

namespace Domain.Entities
{
    public class MedicationHistory
    {
        public Guid Id { get; set; }
        public Guid MedicationId { get; set; }
        public Medication? Medication { get; set; }

        public Guid ScheduleId { get; set; }   // Relaciona com o schedule
        public MedicationSchedule? Schedule { get; set; }

        public bool WasTaken { get; set; } = false;
        public DateTime? TakenAt { get; set; }

        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
