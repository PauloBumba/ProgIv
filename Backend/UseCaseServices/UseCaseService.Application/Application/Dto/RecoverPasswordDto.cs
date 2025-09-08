using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
   
        public class RecoverPassswordDto
        {
            [PasswordPropertyText]
            [Required(ErrorMessage = "Campo é Obrigatorio")]
            public string password { get; set; } = string.Empty;
            [Required(ErrorMessage = "Campo é Obrigatorio")]
            public string Token { get; set; } = string.Empty;
            [Required(ErrorMessage = "Campo  é Obrigatorio")]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;
        }
    
}
