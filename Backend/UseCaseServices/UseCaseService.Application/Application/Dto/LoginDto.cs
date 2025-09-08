using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Dto
{
    public class LoginDto 
    {


        [Required(ErrorMessage = "Campo Obrigatorio")]
        [EmailAddress(ErrorMessage = "Exige @gmail.com")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Campo Obrigatorio")]
        [PasswordPropertyText]
        public string PassWord { get; set; } = string.Empty;

        [Required(ErrorMessage = "Campo Obrigatorio")]
        public bool RememberMe { get; set; }

        
    }
}
