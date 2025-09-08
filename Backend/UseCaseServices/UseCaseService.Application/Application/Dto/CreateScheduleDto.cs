using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
    public class CreateScheduleDto
    {
        [Required(ErrorMessage = "O ID do medicamento é obrigatório")]
        public Guid MedicationId { get; set; }

        [Required(ErrorMessage = "O horário é obrigatório")]
        public TimeSpan TimeOfDay { get; set; }

        public bool Enabled { get; set; } = true;
    }
}
