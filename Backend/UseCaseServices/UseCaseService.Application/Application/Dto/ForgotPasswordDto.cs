using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
    
        public class ForgotPasswordDto
        {
            [Required(ErrorMessage = "Email é obrigatorio")]
            [EmailAddress(ErrorMessage = "Campo para Email")]
            public string Email { get; set; } = string.Empty;
        }
    
}
