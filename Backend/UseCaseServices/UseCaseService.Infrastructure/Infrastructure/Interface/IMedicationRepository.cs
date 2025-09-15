using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Interface
{
    public interface IMedicationRepository
    {
        Task<IEnumerable<Medication>> GetAllMedicationsAsync();
        Task<Medication?> GetMedicationByIdAsync(long id); // Atualizado de Guid para long
        Task<Medication?> AddMedicationAsync(Medication medication);
        Task<bool> DeleteMedicationAsync(long id); // Atualizado de Guid para long
        Task<Medication?> UpdateMedicationAsync(Medication medication);

        // Schedules
        Task<MedicationSchedule?> AddMedicationScheduleAsync(MedicationSchedule schedule);
        Task<IEnumerable<MedicationSchedule>> GetSchedulesByMedicationIdAsync(long medId);
        Task<MedicationSchedule?> GetScheduleByIdAsync(long scheduleId);
        Task<bool> DeleteScheduleAsync(long scheduleId);
        Task<MedicationSchedule?> UpdateScheduleAsync(MedicationSchedule schedule);

        // Histories
        Task<MedicationHistory?> AddHistoryAsync(MedicationHistory history);
        Task<MedicationHistory?> GetMedicationHistoryByIdAsync(long historyId);
        Task<IEnumerable<MedicationHistory>> GetHistoriesByMedicationIdAsync(long medId);
        Task<MedicationHistory?> UpdateMedicationHistoryAsync(MedicationHistory history);
    }
}
