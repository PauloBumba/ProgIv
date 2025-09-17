using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
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
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<UserCaseDbContext>();
            var connectionString = configuration.GetConnectionString("MySqlConnection");

            builder.UseMySql(connectionString,
                ServerVersion.AutoDetect(connectionString),
                x => x.MigrationsAssembly("Infrastructure"));

            return new UserCaseDbContext(builder.Options);
        }
    }

}
