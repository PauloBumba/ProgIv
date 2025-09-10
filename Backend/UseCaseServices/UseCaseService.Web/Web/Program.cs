using Application;
using Application.Interface;
using Application.Services;
using Domain.Entities;
using Domain.Typing;
using Infrastructure;

using Infrastructure.Persistence;

using MediatR;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Web.Extensions;
using Web.Helpers;

var builder = WebApplication.CreateBuilder(args);
// Detecta se está dentro do Docker (variável de ambiente opcional)
var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

// Escolhe a connection string correta
var connectionString = isDocker
    ? builder.Configuration.GetConnectionString("MySqlConnection") // dentro do Docker
    : "Server=localhost;Port=3306;Database=MedicationDb;User=admin;Password=admin123;"; // fora do Docker

builder.Services.AddDbContext<UserCaseDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null
            );
        });
});

// Identity com EF
builder.Services.AddIdentity<UserEntities, IdentityRole>()
    .AddEntityFrameworkStores<UserCaseDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

// Configuração do Cookie de Autenticação
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "MenuOnline.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // HTTPS obrigatório
    options.Cookie.SameSite = SameSiteMode.None;             // Permite cross-site cookies
    options.LoginPath = "/auth/login";
    options.LogoutPath = "/auth/logout";
    options.AccessDeniedPath = "/auth/access-denied";
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.SlidingExpiration = true;
    // Armazenamento em memória para sessões
});



// MVC e Controllers
builder.Services.AddControllersWithViews();

// SignalR
builder.Services.AddSignalR();

// Serviços customizados
builder.Services.AddScoped<IFileStorageService, FileStorageService>();


// Camadas da aplicação
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

// JWT (se estiver usando)
builder.Services.AddJwtExtension(builder.Configuration);
builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("EmailConfig"));
builder.Services.AddTransient<ISendEmails, SendEmail>();

// CORS com credenciais e origem HTTPS do React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger com JWT (se usar)
builder.Services.AddSwaggerWithJwt();

var app = builder.Build();

// Criação do admin (se precisar)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UserCaseDbContext>();

    // Aplica migrations
    db.Database.Migrate();

    db.SaveChanges();
    var services = scope.ServiceProvider;
    var adminInitializer = services.GetRequiredService<IAdminServices>();

    await adminInitializer.CreateAdmin();
}
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var adminInitializer = services.GetRequiredService<IAdminServices>();

    await adminInitializer.CreateAdmin();
}
// Middlewares

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles(); // para wwwroot, padrão

app.UseStaticFiles(); // para wwwroot, padrão

// Garante que a pasta uploads existe antes de configurar os arquivos estáticos
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseRouting();

app.UseCors("AllowFrontend");
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    Secure = CookieSecurePolicy.Always,
    HttpOnly = HttpOnlyPolicy.Always,
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();