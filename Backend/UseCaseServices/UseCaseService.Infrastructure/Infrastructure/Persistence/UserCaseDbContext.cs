using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class UserCaseDbContext : IdentityDbContext<UserEntities>
    {
        public UserCaseDbContext(DbContextOptions<UserCaseDbContext> options)
             : base(options)
        {
        }

        // ================== DbSets ==================
        public new  DbSet<UserEntities> Users { get; set; }
        public DbSet<PasswordResetCode> PasswordReset { get; set; }
        public DbSet<AddressEntity> Addresses { get; set; }

        public DbSet<Medication> Medications { get; set; }
        public DbSet<MedicationSchedule> MedicationSchedules { get; set; }
        public DbSet<MedicationHistory> MedicationHistories { get; set; }

        // ================== Configurações ==================
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ---------- PasswordResetCode ----------
            builder.Entity<PasswordResetCode>()
                .HasOne(p => p.User)
                .WithMany(u => u.PasswordResetCodes)
                .HasForeignKey(p => p.UserId);

            // ---------- Address ----------
            builder.Entity<AddressEntity>()
                .HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId);

            // ---------- Medication ----------
            builder.Entity<Medication>()
                .HasMany(m => m.Schedules)
                .WithOne(s => s.Medication)
                .HasForeignKey(s => s.MedicationId);

            builder.Entity<Medication>()
                .HasMany(m => m.History)
                .WithOne(h => h.Medication)
                .HasForeignKey(h => h.MedicationId);

            builder.Entity<Medication>()
                .HasOne(m => m.User)
                .WithMany(u => u.Medications)
                .HasForeignKey(m => m.UserId);

            // ---------- MedicationSchedule ----------
            builder.Entity<MedicationSchedule>()
                .HasMany(s => s.Histories)
                .WithOne(h => h.Schedule)
                .HasForeignKey(h => h.ScheduleId);

            builder.Entity<MedicationSchedule>()
                .HasOne(s => s.User)
                .WithMany() // Usuário pode ter múltiplos schedules
                .HasForeignKey(s => s.UserId);
        }
    }
}
