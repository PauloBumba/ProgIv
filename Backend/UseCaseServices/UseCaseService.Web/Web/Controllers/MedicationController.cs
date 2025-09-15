using Application.Commands.MedicationCommand;
using Application.Dto;
using Application.Dto.MedicationDto;
using Application.Queries;
using Application.Response;
using Application.Services;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MedicationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUserContextService _userContextService;

    public MedicationsController(IMediator mediator, IUserContextService userContextService)
    {
        _mediator = mediator;
        _userContextService = userContextService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _mediator.Send(new GetAllMedicationsQuery());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao listar medicações: {ex.Message}"));
        }
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id)
    {
        try
        {
            var result = await _mediator.Send(new GetMedicationByIdQuery(id));
            return result == null
                ? NotFound(EnvelopResponse<string>.Failure("Medicação não encontrada."))
                : Ok(EnvelopResponse<Medication>.Success(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao buscar medicação: {ex.Message}"));
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMedicationDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                                       .SelectMany(v => v.Errors)
                                       .Select(e => e.ErrorMessage)
                                       .ToList();
                var allErrors = string.Join("; ", errors);
                return BadRequest(EnvelopResponse<string>.Failure(allErrors));
            }

            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(EnvelopResponse<string>.Failure("Usuário não autenticado."));

            var command = new CreateMedicationCommand(dto.Name, dto.Strength, dto.Notes, userId);
            var result = await _mediator.Send(command);

            return result.isSuccess ? Ok(result) : BadRequest(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao criar medicação: {ex.Message}"));
        }
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update( [FromBody] UpdateMedicationDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                                       .SelectMany(v => v.Errors)
                                       .Select(e => e.ErrorMessage)
                                       .ToList();
                var allErrors = string.Join("; ", errors);
                return BadRequest(EnvelopResponse<string>.Failure(allErrors));
            }

            var command = new UpdateMedicationCommand(dto.Id,dto.Name, dto.Strength, dto.Notes);
            var result = await _mediator.Send(command);

            return result.isSuccess ? Ok(result) : NotFound(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao atualizar medicação: {ex.Message}"));
        }
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var command = new DeleteMedicationCommand(id);
            var result = await _mediator.Send(command);

            return result.isSuccess ? Ok(result) : NotFound(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao deletar medicação: {ex.Message}"));
        }
    }
}
