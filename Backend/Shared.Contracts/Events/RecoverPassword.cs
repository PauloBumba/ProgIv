using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public class PasswordRecoveryRequestedEvent
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public DateTime CreateTime { get; set; }= DateTime.UtcNow;
    }
}