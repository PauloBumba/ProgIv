using Domain.Constants;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Typing
{
    public class AdminTyping
    {
        public string FullName { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public TypeUser Role { get; set; } = TypeUser.Admin; 
    }
}
