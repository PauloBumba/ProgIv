using Application.Response;
using Application.Security;
using Domain.Entities;
using Domain.Typing;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public class AdminServices : IAdminServices
    {
        private readonly UserManager<UserEntities> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IJwyServices _jwtSecurity;
        public AdminServices(UserManager<UserEntities> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IJwyServices jwtSecurity)
        {

            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _jwtSecurity = jwtSecurity;
        }

        public async Task<EnvelopResponse<string>> CreateAdmin()
        {
            var adminConfig = _configuration.GetSection("AdminConfig").Get<AdminTyping>();

            if (adminConfig == null)
            {
                return new EnvelopResponse<string>
                {
                    Message = "Erro no appsetting",
                    isSuccess = false,
                    Data = null,
                };
                throw new Exception("Erro ao carregar dados so Appsetting");
            }

            var user = await _userManager.FindByEmailAsync(adminConfig.Email);
            if (user != null)
            {
                return new EnvelopResponse<string>
                {
                    Message = "Admin já existe no banco",
                    isSuccess = true
                };
            }

            var registerAdmin = new UserEntities
            {
                FullName = adminConfig.FullName,
                Email = adminConfig.Email,
                EmailConfirmed = true,
                UserName = adminConfig.Email.Split('@')[0].Trim()
            };

            if (!await _roleManager.RoleExistsAsync(adminConfig.Role.ToString()))
            {
                var role = await _roleManager.CreateAsync(new IdentityRole(adminConfig.Role.ToString()));
                if (!role.Succeeded)
                {
                    var erro = string.Join(", ", role.Errors.Select(e => e.Description));
                    return new EnvelopResponse<string>
                    {
                        Message = "Erro ao Criar o Role no Banco de Dados",
                        isSuccess = false,
                        Data = erro
                    };
                }
            }

            var create = await _userManager.CreateAsync(registerAdmin, adminConfig.Password);

            if (!create.Succeeded)
            {
                var error = string.Join(",", create.Errors.Select(e => e.Description));
                throw new Exception(error);
            }

            var createRole = await _userManager.AddToRoleAsync(registerAdmin, adminConfig.Role.ToString());

            return new EnvelopResponse<string>
            {
                Message = "Admin Criado Com Sucesso",
                isSuccess = true
            };
        }

    }
}
