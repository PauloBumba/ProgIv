using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserEntities : IdentityUser
    {
        public string CPF { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public DateTime BirthDate { get; set; }
        public Sex? Sex { get; set; }
        public DateTime AdmissionDate { get; set; }

        public DateTime? TerminationDate { get; set; }

        
        public TypeUser Type { get; set; } = TypeUser.user;

        public bool IsActive => !TerminationDate.HasValue || TerminationDate > DateTime.Now;
        public ICollection<AddressEntity> Addresses { get; set; } = new List<AddressEntity>();

        public ICollection<PasswordResetCode> PasswordResetCodes { get; set; } = new List<PasswordResetCode>();

        public ICollection<Medication> Medications { get; set; } = new List<Medication>();
    }

}

