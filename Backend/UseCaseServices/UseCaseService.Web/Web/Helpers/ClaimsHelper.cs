using System.Security.Claims;

namespace Web.Helpers
{
    public static class ClaimsHelper
    {
        public static string GetUserId()
        {
            var httpContext = new HttpContextAccessor().HttpContext;
            var userId = httpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("Usuário não autenticado.");

            return userId;
        }
    }
}
