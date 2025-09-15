using Application.Commands.MedicationCommand;
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
    public class HistoryController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUserContextService _userContextService;

        public HistoryController(IMediator mediator, IUserContextService userContextService)
        {
            _mediator = mediator;
            _userContextService = userContextService;
        }

        // POST: /api/History/mark-taken/{scheduleId}
        [HttpPost("mark-taken/{scheduleId:guid}")]
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
        [HttpGet("{medicationId:guid}")]
        public async Task<IActionResult> GetByMedication(long medicationId)
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
    }
}
