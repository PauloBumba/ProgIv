
using Application.Security;
using Application.Interface;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
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

        public AuthController(UserManager<UserEntities> userManager, SignInManager<UserEntities> signInManager, IJwyServices securityValue)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _securityValue = securityValue;
        }


        // Inicia o login externo, por exemplo, com Google, Facebook, etc.
        [HttpGet("Login")]
        public IActionResult Login(string provider)
        {
            var redirectUrl = Url.Action("ExternalLoginCallback", "Auth");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        // Retorna a resposta após o login externo ser feito
        [HttpGet("Externallogincallback")]
        public async Task<IActionResult> ExternalLoginCallback(string? returnUrl = null, string? remoteError = null)
        {
            // Define o URL de retorno padrão se não for informado
            returnUrl = returnUrl ?? "http://localhost:5173/Auth/callback";

            // Se houver erro remoto, redireciona com o erro
            if (remoteError != null)
            {
                return Redirect($"{returnUrl}?error={Uri.EscapeDataString(remoteError)}");
            }

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return Redirect($"{returnUrl}?error=Erro+ao+obter+informações+de+login+externo");
            }

            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: true);
            if (result.Succeeded)
            {
                // Login bem-sucedido: gere o JWT aqui
                var existingUser = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

                var jwt = await _securityValue.GerarJwtAsync(existingUser); // Gerar o JWT do usuário existente
                return Redirect($"{returnUrl}?token={Uri.EscapeDataString(jwt)}"); // Codificar o token na URL
            }

            // Usuário não existe, cria um novo usuário
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var name = info.Principal.FindFirstValue(ClaimTypes.Name);
            // Tenta pegar a data de nascimento

            var newUser = new UserEntities
            {
                UserName = email,
                Email = email,
                FullName = name,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(newUser);
            if (!createResult.Succeeded)
            {
                return Redirect($"{returnUrl}?error=Erro+ao+criar+usuário");
            }

            await _userManager.AddLoginAsync(newUser, info);
            await _signInManager.SignInAsync(newUser, isPersistent: false);

            var jwtNovo = await _securityValue.GerarJwtAsync(newUser); // Gerar o JWT para o novo usuário
            return Redirect($"{returnUrl}?token={Uri.EscapeDataString(jwtNovo)}"); // Codificar o token na URL
        }
    }
}