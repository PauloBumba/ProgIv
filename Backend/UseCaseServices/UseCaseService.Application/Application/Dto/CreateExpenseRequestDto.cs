using Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto
{
    public class CreateExpenseRequestDto
    {
        [Required(ErrorMessage = "O título é obrigatório.")]
        [StringLength(100, ErrorMessage = "O título deve ter no máximo 100 caracteres.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [StringLength(1000, ErrorMessage = "A descrição deve ter no máximo 1000 caracteres.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor da despesa é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "A data da despesa é obrigatória.")]
        [DataType(DataType.Date, ErrorMessage = "Data inválida.")]
        [CustomValidation(typeof(CreateExpenseRequestDto), nameof(ValidateExpenseDate))]
        public DateTime ExpenseDate { get; set; }

        [Required(ErrorMessage = "O tipo de despesa é obrigatório.")]
       

       
        public IFormFile? ProofFile { get; set; }

        // Validação customizada da data
        public static ValidationResult? ValidateExpenseDate(DateTime date, ValidationContext context)
        {
            if (date > DateTime.UtcNow)
                return new ValidationResult("A data da despesa não pode ser no futuro.");
            return ValidationResult.Success;
        }
    }
}
