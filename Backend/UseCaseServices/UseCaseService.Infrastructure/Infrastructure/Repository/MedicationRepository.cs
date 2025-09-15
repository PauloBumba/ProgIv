using Domain.Entities;
using Infrastructure.Interface;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class MedicationRepository : IMedicationRepository
    {   
        private readonly UserCaseDbContext _context;

        public MedicationRepository(UserCaseDbContext context)
        {
            _context = context;
        }

        // ========== Medications ==========
        public async Task<Medication?> AddMedicationAsync(Medication medication)
        {
            if (medication == null)
                throw new ArgumentNullException(nameof(medication));

            await _context.Medications.AddAsync(medication);
            await _context.SaveChangesAsync();

            return medication;
        }

        public async Task<bool> DeleteMedicationAsync(long id)
        {
            var medication = await _context.Medications.FindAsync(id);
            if (medication == null)
                return false;

            _context.Medications.Remove(medication);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Medication>> GetAllMedicationsAsync()
        {
            return await _context.Medications
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Medication?> GetMedicationByIdAsync(long id)
        {
            return await _context.Medications
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Medication?> UpdateMedicationAsync(Medication medication)
        {
            if (medication == null)
                throw new ArgumentNullException(nameof(medication));

            _context.Medications.Update(medication);
            await _context.SaveChangesAsync();
            return medication;
        }

        // ========== Schedules ==========
        public async Task<MedicationSchedule?> AddMedicationScheduleAsync(MedicationSchedule schedule)
        {
            if (schedule == null)
                throw new ArgumentNullException(nameof(schedule));

            await _context.MedicationSchedules.AddAsync(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        public async Task<IEnumerable<MedicationSchedule>> GetSchedulesByMedicationIdAsync(long medId)
        {
            return await _context.MedicationSchedules
                .Where(s => s.MedicationId == medId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<MedicationSchedule?> GetScheduleByIdAsync(long scheduleId)
        {
            return await _context.MedicationSchedules
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == scheduleId);
        }

        public async Task<bool> DeleteScheduleAsync(long scheduleId)
        {
            var schedule = await _context.MedicationSchedules.FindAsync(scheduleId);
            if (schedule == null)
                return false;

            _context.MedicationSchedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<MedicationSchedule?> UpdateScheduleAsync(MedicationSchedule schedule)
        {
            if (schedule == null)
                throw new ArgumentNullException(nameof(schedule));

            _context.MedicationSchedules.Update(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        // ========== Histories ==========
        public async Task<MedicationHistory?> AddHistoryAsync(MedicationHistory history)
        {
            if (history == null)
                throw new ArgumentNullException(nameof(history));

            await _context.MedicationHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }

        public async Task<MedicationHistory?> GetMedicationHistoryByIdAsync(long historyId)
        {
            return await _context.MedicationHistories
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.Id == historyId);
        }

        public async Task<IEnumerable<MedicationHistory>> GetHistoriesByMedicationIdAsync(long medId)
        {
            return await _context.MedicationHistories
                .Where(h => h.MedicationId == medId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<MedicationHistory?> UpdateMedicationHistoryAsync(MedicationHistory history)
        {
            if (history == null)
                throw new ArgumentNullException(nameof(history));

            _context.MedicationHistories.Update(history);
            await _context.SaveChangesAsync();
            return history;
        }
    }
}
