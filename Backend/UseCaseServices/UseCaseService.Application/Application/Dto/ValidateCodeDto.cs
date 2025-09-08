using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
    
        public class ValidateCodeDto
        {
            [Required(ErrorMessage = "Email é obrigatorio")]
            [EmailAddress(ErrorMessage = "Campo para Email")]
            public string Email { get; set; } = string.Empty;

            [Required(ErrorMessage = "Codigo é obrigatorio")]
            [MaxLength(6, ErrorMessage = "O codigo deve ter 6 numeros")]
            public string Code { get; set; } = string.Empty;
        }
    
}
