using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Interface
{
    public interface IMedicationRepository
    {
        Task<IEnumerable<Medication>> GetAllMedicationsAsync();
        Task<Medication?> GetMedicationByIdAsync(Guid id);
        Task<Medication?> AddMedicationAsync(Medication medication);
        Task<bool> DeleteMedicationAsync(Guid id);
        Task<Medication?> UpdateMedicationAsync(Medication medication);

        // Schedules
        Task<MedicationSchedule?> AddMedicationScheduleAsync(MedicationSchedule schedule);
        Task<IEnumerable<MedicationSchedule>> GetSchedulesByMedicationIdAsync(Guid medId);
        Task<MedicationSchedule?> GetScheduleByIdAsync(Guid scheduleId);
        Task<bool> DeleteScheduleAsync(Guid scheduleId);
        Task<MedicationSchedule?> UpdateScheduleAsync(MedicationSchedule schedule);

        // Histories
        Task<MedicationHistory?> AddHistoryAsync(MedicationHistory history);
        Task<MedicationHistory?> GetMedicationHistoryByIdAsync(Guid historyId);
        Task<IEnumerable<MedicationHistory>> GetHistoriesByMedicationIdAsync(Guid medId);
        Task<MedicationHistory?> UpdateMedicationHistoryAsync(MedicationHistory history);
    }
}
