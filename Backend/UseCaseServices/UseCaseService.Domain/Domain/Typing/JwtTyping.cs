using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
namespace Domain.Typing
{
    public class JwtTyping
    {
        public string Key { get; set; } = string.Empty;

        public string Issuer { get; set; } = string.Empty;

        public string Audience { get; set; } = string.Empty;

        public SymmetricSecurityKey SecurityKey()
        {
            var CoddingSecret = Encoding.UTF8.GetBytes(Key);
            return new SymmetricSecurityKey(CoddingSecret);
        }
    }
}
