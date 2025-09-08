using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage = "O Id do usuário é obrigatório.")]
        public string UserId { get; set; } = string.Empty;

        public string? FullName { get; set; }

        [EmailAddress(ErrorMessage = "O e-mail informado não é válido.")]
        public string? Email { get; set; }

        [Phone(ErrorMessage = "O número de telefone informado não é válido.")]
        public string? PhoneNumber { get; set; }

        public Sex? Sex { get; set; }

        public string? Role { get; set; }
    }
}
