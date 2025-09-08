using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Application.Interface;


using System.Threading.Tasks;
using Domain.Entities;
using Domain.Typing;

namespace Application.Security
{
    public class JwtSecurity : IJwyServices
    {

        private readonly UserManager<UserEntities> _userManager;

        private readonly IConfiguration _configuration;
        public JwtSecurity(UserManager<UserEntities> userManager, IConfiguration configuration)
        {
            _userManager = userManager;

            _configuration = configuration;
        }

        public async Task<string> GerarJwtAsync(UserEntities user)
        {
            var _jwtConfiguration = _configuration.GetSection("JwtConfig").Get<JwtTyping>();

            if (string.IsNullOrEmpty(_jwtConfiguration?.Key) ||
                string.IsNullOrEmpty(_jwtConfiguration.Issuer) ||
                string.IsNullOrEmpty(_jwtConfiguration.Audience))
            {
                throw new ArgumentNullException(nameof(_jwtConfiguration), "Verificar o appsettings: elemento vazio ou null");
            }

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "Usuário nulo");
            }

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email)
        };

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = _jwtConfiguration.SecurityKey();
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddMinutes(15);

            var token = new JwtSecurityToken(
                _jwtConfiguration.Issuer,
                _jwtConfiguration.Audience,
                claims,
                expires: expiration,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
