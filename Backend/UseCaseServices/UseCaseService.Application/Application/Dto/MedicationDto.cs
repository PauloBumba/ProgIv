using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class MedicationDto
    {
        [Required(ErrorMessage = "O nome do medicamento é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode ter mais que 100 caracteres.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "A dosagem é obrigatória.")]
        [StringLength(50, ErrorMessage = "A dosagem não pode ter mais que 50 caracteres.")]
        public string? Dosage { get; set; }
    }
}
