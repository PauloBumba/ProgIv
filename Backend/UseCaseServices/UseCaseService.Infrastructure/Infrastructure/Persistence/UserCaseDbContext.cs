using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class UserCaseDbContext : IdentityDbContext<UserEntities>
    {
        public UserCaseDbContext(DbContextOptions<UserCaseDbContext> options)
             : base(options)
        {

        }

        public DbSet<UserEntities> User { get; set; }   
        public DbSet<PasswordResetCode> PasswordReset { get; set; }
        public DbSet<AddressEntity> Address { get; set; }

        public DbSet<Medication> Medications { get; set; } 
        public DbSet<MedicationSchedule> MedicationSchedules { get; set; } 
        public DbSet<MedicationHistory> MedicationHistories { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<PasswordResetCode>()
            .HasOne(p => p.User)
            .WithMany(u => u.PasswordResetCodes)
            .HasForeignKey(p => p.UserId);

            builder.Entity<AddressEntity>()
            .HasOne(a => a.User)
            .WithMany(u => u.Addresses)
            .HasForeignKey(a => a.UserId);

            builder.Entity<Medication>().HasMany(m => m.Schedules).WithOne(s => s.Medication).HasForeignKey(s => s.MedicationId);
            builder.Entity<Medication>().HasMany(m => m.History).WithOne(h => h.Medication).HasForeignKey(h => h.MedicationId);
            builder.Entity<Medication>()
           .HasOne(m=>m.User)
           .WithMany(u => u.Medications)
           .HasForeignKey(m=>m.UserId);



        }
    }
}
