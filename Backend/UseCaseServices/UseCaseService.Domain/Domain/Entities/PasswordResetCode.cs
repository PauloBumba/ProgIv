using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class PasswordResetCode
    {
        public long Id { get; set; }

        public string Code { get; set; } = string.Empty;

        public DateTime Expiration { get; set; }
        public bool Used { get; set; } = false;

        public string UserId { get; set; } = string.Empty;

        public virtual UserEntities? User { get; set; }
    }
}
