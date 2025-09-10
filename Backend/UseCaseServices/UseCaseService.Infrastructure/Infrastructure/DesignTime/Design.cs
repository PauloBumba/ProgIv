using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class UserCaseDbContextFactory : IDesignTimeDbContextFactory<UserCaseDbContext>
{
    public UserCaseDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<UserCaseDbContext>();

        // Use localhost quando estiver rodando fora do Docker
        optionsBuilder.UseMySql(
            "Server=127.0.0.1;Port=3306;Database=meubanco;User=usuario;Password=senha123",
            ServerVersion.AutoDetect("Server=127.0.0.1;Port=3306;Database=meubanco;User=usuario;Password=senha123")
        );

        return new UserCaseDbContext(optionsBuilder.Options);
    }
}
