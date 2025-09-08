using Application.Response;
using Domain.Typing;

namespace Web.Helpers
{
    public static class AuthConfigHelper
    {
        public static EnvelopResponse<ExtraLoginTyping> ValidateGoogleConfig(IConfiguration configuration)
        {
            var googleConfig = configuration.GetSection("GoogleConfig").Get<ExtraLoginTyping>();

            if (googleConfig == null || string.IsNullOrEmpty(googleConfig.ClientId) || string.IsNullOrEmpty(googleConfig.ClientSecret))
            {
                return EnvelopResponse<ExtraLoginTyping>.Failure("Erro ao configurar o Google. Verifique o appsettings.json.");
            }

            return EnvelopResponse<ExtraLoginTyping>.Success(googleConfig);
        }
    }
}
