using Application.Commands.MedicationCommand;
using Application.Commands.MedicationSchuduleCommand;
using Application.Dto.MedicationDto;
using Application.Queries;
using Application.Response;
using Application.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SchedulesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUserContextService _userContextService;

        public SchedulesController(IMediator mediator , IUserContextService userContextService)
        {
            _mediator = mediator;
            _userContextService = userContextService;
        }

        // GET /api/schedules/by-medication/1
        [HttpGet("by-medication/{medicationId:long}")]
        public async Task<IActionResult> GetByMedication(long medicationId)
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

        // POST /api/schedules
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateScheduleDto dto)
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
                var userId = _userContextService.GetUserId();
                var command = new CreateScheduleCommand(
                     dto.MedicationId,
                     dto.TimeOfDay,
                     dto.Enabled,
                     dto.RepeatIntervalDays,
                     dto.StartDate,
                     dto.EndDate,
                     userId
                     
                );
                var result = await _mediator.Send(command);

                return result.isSuccess ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, Web.Helpers.ServiceHelper.HandleException<object>(ex, "Erro ao criar schedule."));
            }
        }
        // PUT /api/schedules/123

        [HttpPut("{scheduleId:long}")]
        public async Task<IActionResult> Update(long scheduleId, [FromBody] UpdateScheduleDto dto)
        {
            try
            {
                // Validação automática do DTO via DataAnnotations
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .ToList();
                    return BadRequest(Web.Helpers.ServiceHelper.HandleException<List<string>>(new Exception(),
                        "Erro de validação: " + string.Join(", ", errors)));
                }

                var command = new UpdateScheduleCommand(
                    scheduleId,
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
                return StatusCode(500, Web.Helpers.ServiceHelper.HandleException<object>(ex, "Erro ao atualizar schedule."));
            }
        }
        // POST: /api/History/mark-taken/{scheduleId}
        [HttpPost("mark-taken/{scheduleId:long}")]
        public async Task<IActionResult> MarkTaken(long scheduleId)
        {
            try
            {
                var userId = _userContextService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(EnvelopResponse<string>.Failure("Usuário não autenticado."));

                var command = new MarkScheduleTakenCommand(scheduleId, userId);
                var result = await _mediator.Send(command);

                return result.isSuccess
                    ? Ok(result)
                    : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao marcar medicação: {ex.Message}"));
            }
        }

        // GET: /api/History/{medicationId}
        [HttpGet("{medicationId:long}")]
        public async Task<IActionResult> GetByMedications(long medicationId)
        {
            try
            {
                var result = await _mediator.Send(new GetHistoriesByMedicationQuery(medicationId));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao buscar histórico: {ex.Message}"));
            }
        }
    

        // DELETE /api/schedules/123
        [HttpDelete("{scheduleId:long}")]
        public async Task<IActionResult> Delete(long scheduleId)
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
