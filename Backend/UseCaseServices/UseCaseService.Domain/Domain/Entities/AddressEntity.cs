using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class AddressEntity
    {
        public long Id { get; set; }
        public string Country { get; set; } = "Brasil";

        public string FederalState { get; set; } = string.Empty;

        public string ZipCode { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string District { get; set; } = string.Empty;

        public string NumberHouse { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public virtual UserEntities? User { get; set; }
    }
}
