using Application;
using Application.Interface;
using Application.Services;
using Domain.Entities;
using Infrastructure;
using Infrastructure.Interface;
using Infrastructure.Persistence;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Web.Extensions;
using Web.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Conexão DB
var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
var connectionString = isDocker
    ? builder.Configuration.GetConnectionString("MySqlConnection")
    : "Server=localhost;Port=3306;Database=MedicationDb;User=admin;Password=admin123;";

builder.Services.AddDbContext<UserCaseDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure(10, TimeSpan.FromSeconds(5), null);
        });
});

// Identity com EF
builder.Services.AddIdentity<UserEntities, IdentityRole>()
    .AddEntityFrameworkStores<UserCaseDbContext>()
    .AddDefaultTokenProviders();

// Configuração do Cookie Identity
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "MenuOnline.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // HTTPS obrigatório
    options.Cookie.SameSite = SameSiteMode.None;             // Cross-domain
    options.LoginPath = "/auth/login";
    options.LogoutPath = "/auth/logout";
    options.AccessDeniedPath = "/auth/access-denied";
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.SlidingExpiration = true;
});

// Session e cache
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

// CORS para React
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

// Controllers e MVC
builder.Services.AddControllersWithViews();

// Serviços customizados
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IMedicationRepository, MedicationRepository>();
builder.Services.AddScoped<IUserContextService, UserContextService>();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddExternalAuthentication(builder.Configuration); // Google, etc.


// Swagger (opcional)
builder.Services.AddSwaggerWithJwt();

var app = builder.Build();

// Migrations e admin
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UserCaseDbContext>();
    db.Database.Migrate();

    var services = scope.ServiceProvider;
    var adminInitializer = services.GetRequiredService<IAdminServices>();
    await adminInitializer.CreateAdmin();
}

// Middleware pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"));
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Pasta uploads
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseRouting();

app.UseCors("AllowFrontend");
app.UseSession();
app.UseAuthentication();  // 🔑 antes do Authorization
app.UseAuthorization();
app.UseMiddleware<AuthenticationDebugMiddleware>();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    Secure = CookieSecurePolicy.Always,
    HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always,
});

// Rota default
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();