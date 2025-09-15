using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Dto.MedicationDto
{
    public class CreateScheduleDto
    {
        [Required(ErrorMessage = "O ID do medicamento é obrigatório")]
        [Range(1, long.MaxValue, ErrorMessage = "O ID do medicamento deve ser maior que zero")]
        public long MedicationId { get; set; }

        [Required(ErrorMessage = "O horário é obrigatório")]
        public TimeSpan TimeOfDay { get; set; }

        public bool Enabled { get; set; } = true;

        [Range(0, int.MaxValue, ErrorMessage = "O intervalo de repetição não pode ser negativo")]
        public int RepeatIntervalDays { get; set; } = 1;

        [DataType(DataType.DateTime, ErrorMessage = "Data inicial inválida")]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.DateTime, ErrorMessage = "Data final inválida")]
        [CustomValidation(typeof(CreateScheduleDto), nameof(ValidateEndDate))]
        public DateTime? EndDate { get; set; }

        // Validação customizada para EndDate
        public static ValidationResult? ValidateEndDate(DateTime? endDate, ValidationContext context)
        {
            var instance = (CreateScheduleDto)context.ObjectInstance;
            if (endDate.HasValue && instance.StartDate.HasValue && endDate < instance.StartDate)
            {
                return new ValidationResult("A data final não pode ser anterior à data inicial");
            }
            return ValidationResult.Success;
        }
    }
}
