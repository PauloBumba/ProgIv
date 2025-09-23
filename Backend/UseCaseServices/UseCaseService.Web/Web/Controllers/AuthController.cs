using Application.Interface;
using Application.Response;
using Application.Security;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<UserEntities> _userManager;
        private readonly SignInManager<UserEntities> _signInManager;
        private readonly IJwyServices _securityValue;
        private readonly ILogger<AuthController> _logger;
        private readonly IUserServices _userServices;

        public AuthController(
            UserManager<UserEntities> userManager,
            SignInManager<UserEntities> signInManager,
            IJwyServices securityValue,
            ILogger<AuthController> logger,
            IUserServices userServices
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _securityValue = securityValue;
            _logger = logger;
            _userServices = userServices;
        }

        [HttpGet("login")]
        public IActionResult Login(string provider, string? returnUrl = null)
        {
            returnUrl ??= "https://localhost:5173/Auth/callback";
            var redirectUrl = Url.Action("ExternalLoginCallback", "Auth", new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        [HttpGet("ExternalLoginCallback")]
        public async Task<IActionResult> ExternalLoginCallback(string? returnUrl = null, string? remoteError = null)
        {
            returnUrl ??= "https://localhost:5173/Auth/callback";

            try
            {
                if (!string.IsNullOrEmpty(remoteError))
                {
                    _logger.LogWarning("Login externo retornou erro: {Error}", remoteError);
                    return Redirect($"{returnUrl}?error={Uri.EscapeDataString(remoteError)}");
                }

                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    _logger.LogWarning("Login externo info retornou null");
                    return Redirect($"{returnUrl}?error={Uri.EscapeDataString("Login externo inválido")}");
                }

                var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: true);
                UserEntities user;

                if (result.Succeeded)
                {
                    user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey)
                           ?? throw new Exception("Usuário não encontrado após login externo");

                    // 🔑 Importante: garante que o cookie do Identity é criado
                    await AddClaimsAndSignIn(user, info.Principal?.FindFirstValue("picture"));

                    _logger.LogInformation("Usuário existente logado via {Provider}: {Email}", info.LoginProvider, user.Email);
                }

                else
                {
                    var email = info.Principal?.FindFirstValue(ClaimTypes.Email);
                    var name = info.Principal?.FindFirstValue(ClaimTypes.Name) ?? "Usuário";
                    var picture = info.Principal?.FindFirstValue("picture"); // claim custom do Google

                    if (string.IsNullOrEmpty(email))
                    {
                        _logger.LogWarning("{Provider} não forneceu email", info.LoginProvider);
                        return Redirect($"{returnUrl}?error={Uri.EscapeDataString($"{info.LoginProvider} não forneceu email")}");
                    }

                    // Verifica se usuário já existe
                    var existingUser = await _userManager.FindByEmailAsync(email);
                    if (existingUser != null)
                    {
                        // Vincula login externo se ainda não estiver
                        var logins = await _userManager.GetLoginsAsync(existingUser);
                        if (!logins.Any(l => l.LoginProvider == info.LoginProvider && l.ProviderKey == info.ProviderKey))
                        {
                            await _userManager.AddLoginAsync(existingUser, info);
                            _logger.LogInformation("Login externo vinculado a usuário existente: {Email}", email);
                        }

                        await AddClaimsAndSignIn(existingUser, picture);
                        return Redirect(returnUrl);
                    }

                    // Cria novo usuário
                    user = new UserEntities
                    {
                        UserName = email,
                        Email = email,
                        FullName = name,
                        EmailConfirmed = true
                    };

                    var createResult = await _userManager.CreateAsync(user);
                    if (!createResult.Succeeded)
                    {
                        _logger.LogError("Falha ao criar usuário {Email}: {Errors}", email, string.Join(", ", createResult.Errors.Select(e => e.Description)));
                        return Redirect($"{returnUrl}?error={Uri.EscapeDataString("Erro ao criar usuário")}");
                    }

                    await _userManager.AddLoginAsync(user, info);
                    await AddClaimsAndSignIn(user, picture);

                    _logger.LogInformation("Novo usuário criado e logado via {Provider}: {Email}", info.LoginProvider, email);
                }

                return Redirect(returnUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no callback de login externo");
                return Redirect($"{returnUrl}?error={Uri.EscapeDataString("Erro ao processar login externo")}");
            }
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                    return Unauthorized(EnvelopResponse<object>.Failure("Usuário não autenticado"));

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
                var email = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                var fullName = User.FindFirst(ClaimTypes.Name)?.Value ?? email;

                var roles = User.Claims
                                .Where(c => c.Type == ClaimTypes.Role)
                                .Select(c => c.Value)
                                .ToList();

                var userData = new
                {
                    id = userId,
                    email,
                    fullName,
                    roles
                };

                return Ok(EnvelopResponse<object>.Success(userData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no /auth/me");
                return StatusCode(500, EnvelopResponse<object>.Failure("Erro ao buscar usuário: " + ex.Message));
            }
        }


        /// <summary>
        /// Garante que os claims essenciais estão salvos e refaz o SignIn.
        /// </summary>
        private async Task AddClaimsAndSignIn(UserEntities user, string? picture)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Name, user.FullName ?? user.UserName ?? "")
            };

            if (!string.IsNullOrEmpty(picture))
                claims.Add(new Claim("picture", picture));

            var existingClaims = await _userManager.GetClaimsAsync(user);
            foreach (var claim in claims)
            {
                if (!existingClaims.Any(c => c.Type == claim.Type && c.Value == claim.Value))
                {
                    await _userManager.AddClaimAsync(user, claim);
                }
            }

            // Recria cookie já com os claims
            await _signInManager.SignInAsync(user, isPersistent: true);
        }
    }
}
