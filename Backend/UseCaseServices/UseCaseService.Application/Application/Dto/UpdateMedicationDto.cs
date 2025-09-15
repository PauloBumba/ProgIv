using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
    public class UpdateMedicationDto
    {    [Required]
        public long Id { get; set; }
    [Required(ErrorMessage = "O nome do medicamento é obrigatório")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 100 caracteres")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "A concentração do medicamento é obrigatória")]
        [StringLength(50, ErrorMessage = "A concentração deve ter no máximo 50 caracteres")]
        public string Strength { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "As notas devem ter no máximo 500 caracteres")]
        public string? Notes { get; set; }
    }
}
