using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Constants
{
    public class RoleConstants
    {
        public static class Roles
        {
            public const string Admin = nameof(TypeUser.Admin);
            public const string Coloborador = nameof(TypeUser.user);
            
        }
    }
}
