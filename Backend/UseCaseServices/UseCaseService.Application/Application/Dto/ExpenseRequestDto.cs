using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto
{
    public class ExpenseRequestDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O título é obrigatório")]
        [StringLength(100, ErrorMessage = "O título deve ter no máximo 100 caracteres")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "A descrição é obrigatória")]
        [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres")]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "A data da despesa é obrigatória")]
        [DataType(DataType.Date)]
        public DateTime ExpenseDate { get; set; }

        [Url(ErrorMessage = "O caminho do comprovante deve ser uma URL válida")]
        public string ProofFilePath { get; set; } = string.Empty;

        [Required(ErrorMessage = "O status é obrigatório")]
        public string Status { get; set; } = string.Empty;

        public string TypeName { get; set; }
        public string? UserName { get; set; }
    }
}
