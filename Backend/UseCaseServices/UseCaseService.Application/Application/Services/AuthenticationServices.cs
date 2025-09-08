using Application.Dto;
using Application.Interface;
using Application.Response;
using Application.Security;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AuthenticationServices : IAuthentication
    {
        private readonly UserManager<UserEntities > _userManager;
        private readonly SignInManager<UserEntities> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwyServices _jwtSecurity;

        public AuthenticationServices(UserManager<UserEntities> userManager, SignInManager<UserEntities> signInManager, RoleManager<IdentityRole> roleManager, IJwyServices jwtSecurity)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jwtSecurity = jwtSecurity;
        }
       

        public async Task<EnvelopResponse<string>> Login(LoginDto login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null)
            {
                return new EnvelopResponse<string>
                {
                    Message = "Usuario não cadastrado",
                    isSuccess = false,
                    Data = user?.Email
                };
            }

            if (!await _userManager.CheckPasswordAsync(user, login.PassWord))
            {
                return new EnvelopResponse<string> { 
                    Message = "Senha Invalida , digite a senha correta",
                    isSuccess = false,

                };
            }

            var result = await _signInManager.PasswordSignInAsync(user, login.PassWord, isPersistent: true, lockoutOnFailure: false);

            if (result.IsLockedOut)
            {
                return new EnvelopResponse<string>
                {
                    Message = "Usuário bloqueado temporariamente. Tente novamente mais tarde.",
                    isSuccess = false
                };
            }


            var token = await _jwtSecurity.GerarJwtAsync(user);

            return new EnvelopResponse<string>
            {
                Message = "Login Com Sucesso",
                isSuccess = true,
                Data = token
            };
        }

        public async Task<EnvelopResponse<string>> Logout()
        {
            await _signInManager.SignOutAsync();

            return new EnvelopResponse<string>
            {
                Message = "Logout Feito Com Sucesso",
                isSuccess = true,
                Data = null
            };
        }
    }
}
