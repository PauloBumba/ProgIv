using Application.Interface;
using Application.MassTransit.Consumers;
using Application.MassTrasit.Consumers;
using Application.Services;
using Domain.Settings;
using Infrastructure.Services;
using Infrastruture.Hubs;
using Infrastruture.Interface;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// JWT config
var jwtSection = builder.Configuration.GetSection("JwtConfig");
var jwtKey = jwtSection["Key"];
var jwtIssuer = jwtSection["Issuer"];
var jwtAudience = jwtSection["Audience"];

// SignalR
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

// Configurações Email
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// SignalR Notification Service
builder.Services.AddScoped<ISignalRNotificationService, SignalRNotificationService>();

// MassTransit + RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<PasswordRecoveryRequestedConsumer>();
    x.AddConsumer<MedicationCreatedConsumer>();
    x.AddConsumer<ScheduleCreatedConsumer>();
    x.AddConsumer<MedicationTakenConsumer>();
    x.AddConsumer<CreateUserConsumer>();
    x.UsingRabbitMq((context, cfg) =>
    {
        var rabbitHost = Environment.GetEnvironmentVariable("RabbitMQ__Host") ?? "localhost";

        cfg.Host(rabbitHost, "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ReceiveEndpoint("fila-password-recovery", e =>
        {
            e.ConfigureConsumer<PasswordRecoveryRequestedConsumer>(context);

            e.UseMessageRetry(r => r.Interval(3, TimeSpan.FromSeconds(5)));
            e.UseInMemoryOutbox();
            e.UseDelayedRedelivery(r => r.Intervals(TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(30)));
        });
        cfg.ReceiveEndpoint("create-user-queue", e =>
        {
            e.ConfigureConsumer<CreateUserConsumer>(context);
        });
        cfg.ReceiveEndpoint("medication-created-queue", e =>
        {
            e.ConfigureConsumer<MedicationCreatedConsumer>(context);
        });

        cfg.ReceiveEndpoint("schedule-created-queue", e =>
        {
            e.ConfigureConsumer<ScheduleCreatedConsumer>(context);
        });

        cfg.ReceiveEndpoint("medication-taken-queue", e =>
        {
            e.ConfigureConsumer<MedicationTakenConsumer>(context);
        });
    });


});
builder.Services.AddMassTransitHostedService();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowGateway", policy =>
    {
        policy.WithOrigins("https://localhost:5173", "https://localhost:7085")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        // ⚡ SignalR: pega token da query string
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/notificationHub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowGateway");
app.UseRouting();             // 🚨 UseRouting antes de Authentication/Authorization
app.UseAuthentication();      // 🚨 Authentication primeiro
app.UseAuthorization();       // 🚨 Authorization logo depois

// MapHub com proteção JWT
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotificationHub>("/notificationHub")
             .RequireAuthorization();
});

app.Run();
