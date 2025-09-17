using Application.Security;
using Application.Interface;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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

        public AuthController(
            UserManager<UserEntities> userManager,
            SignInManager<UserEntities> signInManager,
            IJwyServices securityValue,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _securityValue = securityValue;
            _logger = logger;
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
                    return Redirect($"{Uri.EscapeDataString(returnUrl)}?error={Uri.EscapeDataString(remoteError)}");
                }

                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    _logger.LogWarning("Login externo info retornou null");
                    return Redirect($"{Uri.EscapeDataString(returnUrl)}?error={Uri.EscapeDataString("Login externo inválido")}");
                }

                var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: true);
                UserEntities user;

                if (result.Succeeded)
                {
                    user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey)
                           ?? throw new Exception("Usuário não encontrado após login externo");
                    _logger.LogInformation("Usuário existente logado via {Provider}: {Email}", info.LoginProvider, user.Email);
                }
                else
                {
                    var email = info.Principal?.FindFirstValue(ClaimTypes.Email);
                    var name = info.Principal?.FindFirstValue(ClaimTypes.Name) ?? "Usuário";

                    if (string.IsNullOrEmpty(email))
                    {
                        _logger.LogWarning("{Provider} não forneceu email", info.LoginProvider);
                        return Redirect($"{Uri.EscapeDataString(returnUrl)}?error={Uri.EscapeDataString($"{info.LoginProvider} não forneceu email")}");
                    }

                    // Verifica se usuário já existe
                    var existingUser = await _userManager.FindByEmailAsync(email);
                    if (existingUser != null)
                    {
                        // Vincula login externo, se ainda não estiver vinculado
                        var logins = await _userManager.GetLoginsAsync(existingUser);
                        if (!logins.Any(l => l.LoginProvider == info.LoginProvider && l.ProviderKey == info.ProviderKey))
                        {
                            await _userManager.AddLoginAsync(existingUser, info);
                            _logger.LogInformation("Login externo vinculado a usuário existente: {Email}", email);
                        }

                        await _signInManager.SignInAsync(existingUser, isPersistent: false);
                        _logger.LogInformation("Usuário existente logado via {Provider}: {Email}", info.LoginProvider, email);

                        return Redirect(Uri.EscapeDataString(returnUrl));
                    }

                    // Se não existe, cria novo usuário
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
                        return Redirect($"{Uri.EscapeDataString(returnUrl)}?error={Uri.EscapeDataString("Erro ao criar usuário")}");
                    }

                    await _userManager.AddLoginAsync(user, info);
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    _logger.LogInformation("Novo usuário criado e logado via {Provider}: {Email}", info.LoginProvider, email);
                }


                return Redirect(returnUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no callback de login externo");
                return Redirect($"{Uri.EscapeDataString(returnUrl)}?error={Uri.EscapeDataString("Erro ao processar login externo")}");
            }
        }
        [AllowAnonymous]
        [HttpGet("me")]
public async Task<IActionResult> GetCurrentUser()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
        return Unauthorized();

    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
        return NotFound();

    var roles = await _userManager.GetRolesAsync(user);

    return Ok(new
    {
        id = user.Id,
        email = user.Email,
        fullName = user.FullName,
        roles
    });
}

    }
}
