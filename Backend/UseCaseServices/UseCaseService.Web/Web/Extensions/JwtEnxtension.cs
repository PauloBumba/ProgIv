using Domain.Typing;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Web.Extensions
{
    
        public static class JwtAuthenticationExtensions
        {
            public static IServiceCollection AddJwtExtension(this IServiceCollection services, IConfiguration configuration)
            {
                var jwtConfig = configuration.GetSection("JwtConfig").Get<JwtTyping>();

                if (jwtConfig == null || string.IsNullOrEmpty(jwtConfig.Key))
                {
                    throw new InvalidOperationException("Configuração do JWT não encontrada ou inválida!");
                }

                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = jwtConfig.SecurityKey(),
                        ValidateIssuer = true,
                        ValidIssuer = jwtConfig.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtConfig.Audience,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

                return services;
            }
        }
    }

