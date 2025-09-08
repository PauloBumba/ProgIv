using Infrastructure.Persistence;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DesignTime
{

   

   
        public class UberDbContextFactory : IDesignTimeDbContextFactory<UserCaseDbContext>
        {
            public UserCaseDbContext CreateDbContext(string[] args)
            {
                var optionsBuilder = new DbContextOptionsBuilder<UserCaseDbContext>();
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=UseCaseDb;Trusted_Connection=True;MultipleActiveResultSets=true");
                return new UserCaseDbContext(optionsBuilder.Options);
            }
        }

    

}

