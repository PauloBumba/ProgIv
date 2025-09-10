using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DesignTime
{
    public class UserCaseDbContextFactory : IDesignTimeDbContextFactory<UserCaseDbContext>
    {
        public UserCaseDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<UserCaseDbContext>();

            // conexão local (host)
            var connectionString = "Server=localhost;Port=3306;Database=MedicationDb;User=admin;Password=admin123;";

            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new UserCaseDbContext(optionsBuilder.Options);
        }
    }

}
