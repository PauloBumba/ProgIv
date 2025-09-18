namespace Web.Helpers
{
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.Extensions.Logging;

    public class AuthenticationDebugMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthenticationDebugMiddleware> _logger;
        private readonly IAuthenticationSchemeProvider _schemeProvider;

        public AuthenticationDebugMiddleware(RequestDelegate next, ILogger<AuthenticationDebugMiddleware> logger, IAuthenticationSchemeProvider schemeProvider)
        {
            _next = next;
            _logger = logger;
            _schemeProvider = schemeProvider;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            _logger.LogInformation("=== AUTH DEBUG START ===================================");
            _logger.LogInformation("Request: {Method} {Path}", context.Request.Method, context.Request.Path);
            _logger.LogInformation("=== AUTH DEBUG START ===");
            _logger.LogInformation("User.Identity.IsAuthenticated = {Auth}", context.User.Identity?.IsAuthenticated);
            _logger.LogInformation("Claims: {Claims}", string.Join(", ", context.User.Claims.Select(c => $"{c.Type}={c.Value}")));
            _logger.LogInformation("=== AUTH DEBUG END ===");
            // Log basic headers we care about (without printing secrets)
            if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
                _logger.LogInformation("Header Authorization: {AuthHeader}", authHeader.ToString().Split(' ').FirstOrDefault());
            else
                _logger.LogInformation("Header Authorization: (none)");

            // Log cookies (truncate values)
            foreach (var c in context.Request.Cookies)
            {
                var truncated = c.Value?.Length > 80 ? c.Value.Substring(0, 80) + "..." : c.Value;
                _logger.LogInformation("Cookie: {Key}={Value}", c.Key, truncated);
            }

            // Registered schemes
            var schemes = await _schemeProvider.GetAllSchemesAsync();
            _logger.LogInformation("Registered authentication schemes: {Schemes}", string.Join(", ", schemes.Select(s => s.Name)));

            // Try default authenticate
            try
            {
                var defaultAuth = await context.AuthenticateAsync();
                _logger.LogInformation("AuthenticateAsync() default -> Succeeded={Succeeded} Scheme={Scheme}", defaultAuth?.Succeeded ?? false, defaultAuth?.Ticket?.AuthenticationScheme);
                if (defaultAuth?.Principal != null)
                {
                    _logger.LogInformation("Default principal claims: {Claims}", string.Join(", ", defaultAuth.Principal.Claims.Select(c => $"{c.Type}={c.Value}")));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AuthenticateAsync() (default) threw exception");
            }

            // Try authenticate for common schemes (safe-guard)
            var checkSchemes = new[] { "Identity.Application", "Identity.External", "Bearer", "Google" };
            foreach (var scheme in checkSchemes)
            {
                try
                {
                    var res = await context.AuthenticateAsync(scheme);
                    _logger.LogInformation("AuthenticateAsync('{Scheme}') -> Succeeded={Succeeded}; HasPrincipal={HasPrincipal}", scheme, res?.Succeeded ?? false, res?.Principal != null);
                    if (res?.Principal != null)
                        _logger.LogInformation("Claims for {Scheme}: {Claims}", scheme, string.Join(", ", res.Principal.Claims.Select(c => $"{c.Type}={c.Value}")));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AuthenticateAsync('{Scheme}') threw", scheme);
                }
            }

            _logger.LogInformation("User.Identity.IsAuthenticated = {IsAuthenticated}", context.User?.Identity?.IsAuthenticated ?? false);
            if (context.User?.Identity?.IsAuthenticated == true)
            {
                _logger.LogInformation("HttpContext.User claims: {Claims}", string.Join(", ", context.User.Claims.Select(c => $"{c.Type}={c.Value}")));
            }

            _logger.LogInformation("=== AUTH DEBUG END =====================================");

            await _next(context);
        }
    }

}
