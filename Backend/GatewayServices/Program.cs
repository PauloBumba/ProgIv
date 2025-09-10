using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ReverseProxy.Abstractions.Config;
using System.Text;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Debug);
});

// 🔹 JWT Config
var jwtKey = builder.Configuration["JwtConfig:Key"];
var jwtIssuer = builder.Configuration["JwtConfig:Issuer"];
var jwtAudience = builder.Configuration["JwtConfig:Audience"];

// 🔹 Autenticação JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = System.TimeSpan.Zero
        };

        // 🔹 Suporte SignalR (JWT via query string)
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError(context.Exception, "Erro ao validar JWT");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// 🔹 Configuração do YARP
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(transforms =>
    {
        transforms.AddRequestTransform(context =>
        {
            if (context.HttpContext.Request.Headers.TryGetValue("Authorization", out var token))
            {
                context.ProxyRequest.Headers.Remove("Authorization");
                context.ProxyRequest.Headers.Add("Authorization", token.ToString());
            }

            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogDebug("Proxying request to {Destination} for path {Path}",
                context.DestinationPrefix, context.HttpContext.Request.Path);

            return ValueTask.CompletedTask;
        });
    });

// 🔹 CORS
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

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseWebSockets();      // Tem que vir antes do MapReverseProxy
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapReverseProxy();    // Aqui o YARP intercepta


app.Run();
