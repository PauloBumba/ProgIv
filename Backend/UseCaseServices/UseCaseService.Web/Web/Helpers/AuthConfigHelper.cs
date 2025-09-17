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
        public static EnvelopResponse<FacebookTyping> ValidateFacebookConfig(IConfiguration configuration)
        {
            var fbConfig = configuration.GetSection("FacebookConfig").Get<FacebookTyping>();

            if (fbConfig == null || string.IsNullOrEmpty(fbConfig.AppId) || string.IsNullOrEmpty(fbConfig.AppSecret))
            {
                return EnvelopResponse<FacebookTyping>.Failure("Erro ao configurar o Facebook. Verifique o appsettings.json.");
            }

            return EnvelopResponse<FacebookTyping>.Success(fbConfig);
        }

    }
}
