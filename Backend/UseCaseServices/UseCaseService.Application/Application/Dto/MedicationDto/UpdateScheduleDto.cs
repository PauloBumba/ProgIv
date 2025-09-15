using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto.MedicationDto
{
    public class UpdateScheduleDto
    {
        [Required(ErrorMessage = "O horário do medicamento é obrigatório.")]
        public TimeSpan TimeOfDay { get; set; }

        [Required(ErrorMessage = "O status habilitado é obrigatório.")]
        public bool Enabled { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "O intervalo de repetição deve ser maior que 0.")]
        public int RepeatIntervalDays { get; set; } = 1;

        [Required(ErrorMessage = "A data de início é obrigatória.")]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
