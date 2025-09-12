using Application.Commands.MedicationSchuduleCommand;
using Application.Dto.MedicationDto;
using Application.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SchedulesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SchedulesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{medicationId:guid}")]
        public async Task<IActionResult> GetByMedication(Guid medicationId)
        {
            try
            {
                var result = await _mediator.Send(new GetSchedulesByMedicationQuery(medicationId));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, Web.Helpers.ServiceHelper.HandleException<object>(ex, "Erro ao buscar schedules."));
            }
        }

        [HttpPost("{medicationId:guid}")]
        public async Task<IActionResult> Create(Guid medicationId, [FromBody] CreateScheduleDto dto)
        {
            try
            {
                // Validação de DTO
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .ToList();
                    return BadRequest(Web.Helpers.ServiceHelper.HandleException<List<string>>(new Exception(),
                        "Erro de validação: " + string.Join(", ", errors)));
                }

                var command = new CreateScheduleCommand(
                     medicationId,
                     dto.TimeOfDay,
                     dto.Enabled,
                     dto.RepeatIntervalDays,
                     dto.StartDate,
                     dto.EndDate
                );
                var result = await _mediator.Send(command);

                return result.isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, Web.Helpers.ServiceHelper.HandleException<object>(ex, "Erro ao criar schedule."));
            }
        }

        [HttpDelete("{scheduleId:guid}")]
        public async Task<IActionResult> Delete(Guid scheduleId)
        {
            try
            {
                var command = new DeleteScheduleCommand(scheduleId);
                var result = await _mediator.Send(command);

                return result.isSuccess ? Ok(result) : NotFound(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, Web.Helpers.ServiceHelper.HandleException<object>(ex, "Erro ao deletar schedule."));
            }
        }
    }
}