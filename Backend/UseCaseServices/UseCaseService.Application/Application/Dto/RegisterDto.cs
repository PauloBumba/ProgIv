using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Domain.Enums;

namespace Application.Dto
{


   
   
        public class RegisterDto : IValidatableObject
        {
            [Required(ErrorMessage = "O nome completo é obrigatório.")]
            public string FullName { get; set; } = string.Empty;

            [Required(ErrorMessage = "O e-mail é obrigatório.")]
            [EmailAddress(ErrorMessage = "O e-mail informado não é válido.")]
            public string Email { get; set; } = string.Empty;

            [Required(ErrorMessage = "A senha é obrigatória.")]
            [DataType(DataType.Password)]
            [MinLength(6, ErrorMessage = "A senha deve ter pelo menos 6 caracteres.")]
            public string Password { get; set; } = string.Empty;

            [Required(ErrorMessage = "A confirmação de senha é obrigatória.")]
            [Compare(nameof(Password), ErrorMessage = "A senha e a confirmação não coincidem.")]
            public string ConfirmPassword { get; set; } = string.Empty;

            [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
            [DataType(DataType.Date, ErrorMessage = "Formato de data inválido.")]
            public DateTime DateOfBirth { get; set; }

            [Required(ErrorMessage = "O telefone é obrigatório.")]
            
            public string PhoneNumber { get; set; } = string.Empty;

            [Required(ErrorMessage = "O sexo é obrigatório.")]
            public Sex Sex { get; set; }

            [Required(ErrorMessage = "Pelo menos um endereço é obrigatório.")]
            public List<AdressDto> Addresses { get; set; } = new();

            [Required(ErrorMessage = "O CPF é obrigatório.")]
            [RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve conter 11 dígitos numéricos.")]
            public string CPF { get; set; } = string.Empty;

        [Required(ErrorMessage = "O tipo de usuário é obrigatório.")]
        public TypeUser Role { get; set; }
        
        
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
            {
                var regex = new Regex(@"^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?""':{}|<>])(?=.*\d).+$");
                if (!regex.IsMatch(Password))
                {
                    yield return new ValidationResult(
                        "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.",
                        new[] { nameof(Password) }
                    );
                }
                if (string.IsNullOrWhiteSpace(CPF) || CPF.Length < 11 || !CPF.All(char.IsDigit))
                {
                    yield return new ValidationResult(
                        "O CPF deve conter 11 dígitos numéricos.",
                        new[] { nameof(CPF) }
                    );
                }

            }
        }
    }



