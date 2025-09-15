using Shared.Contracts.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Contracts.Events
{
    public class CreateUserEvents
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;   
        public DateTime CreateTime { get; set; } = DateTime.UtcNow;
       
    }
}
