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
                return services;
            }

            var googleConfig = configResult.Data!;

            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    options.ClientId = googleConfig.ClientId;
                    options.ClientSecret = googleConfig.ClientSecret;

                    // ⚡ Callback alinhado com nosso controller
                    options.CallbackPath = "/signin-google";

                    // Claims
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                    options.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
                    options.ClaimActions.MapJsonKey("picture", "picture");
                });
            var facebookResult = AuthConfigHelper.ValidateFacebookConfig(configuration);

            if (!facebookResult.isSuccess)
            {
                Console.WriteLine($"[WARN] Configuração do Facebook inválida: {facebookResult.Message}");
            }
            else
            {
                var facebookConfig = facebookResult.Data!;

                services.AddAuthentication()
                    .AddFacebook(options =>
                    {
                        options.AppId = facebookConfig.AppId;
                        options.AppSecret = facebookConfig.AppSecret;

                        // ⚡ importante: alinhado com seu controller de callback
                        options.CallbackPath = "/signin-facebook";

                        // Claims extras
                        options.Fields.Add("email");
                        options.Fields.Add("name");
                        options.Fields.Add("picture");
                    });
            }


            return services;
        }
    }
}
