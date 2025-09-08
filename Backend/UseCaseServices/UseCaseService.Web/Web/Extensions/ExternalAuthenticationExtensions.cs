using Domain.Typing;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Web.Helpers;

namespace Web.Extensions
{
    public static class ExternalAuthenticationExtensions
    {
        public static IServiceCollection AddExternalAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var configResult = AuthConfigHelper.ValidateGoogleConfig(configuration);

            if (!configResult.isSuccess)
            {
                Console.WriteLine($"[WARN] Configuração do Google inválida: {configResult.Message}");
                // Aqui você pode disparar algum evento, ou colocar um flag, ou outro mecanismo
                // para depois algum serviço de notificação avisar o time ou o usuário.
                return services; // continua sem o Google
            }

            var googleConfig = configResult.Data!;

            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    options.ClientId = googleConfig.ClientId;
                    options.ClientSecret = googleConfig.ClientSecret;
                    options.CallbackPath = "/signin-google";
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                });

            return services;
        }

    }
}
