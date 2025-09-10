using Application.Dto;
using Application.Response;
using Application.Services;
using Domain.Entities;
using Infrastructure.Persistence;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shared.Contracts.Contracts;
using Shared.Contracts.Events;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MedicationsController : ControllerBase
{
    private readonly UserCaseDbContext _db;
    private readonly UserContextService _userContextService;
    private readonly IPublishEndpoint _publish;
    public MedicationsController(UserCaseDbContext db, UserContextService userContextService,  IPublishEndpoint publish)
    {
        _db = db;
        _userContextService = userContextService;
        _publish = publish;
    }

    // GET: /api/Medications
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var meds = await _db.Medications.Include(m => m.Schedules).ToListAsync();
            return Ok(EnvelopResponse<List<Medication>>.Success(meds));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao listar medicações: {ex.Message}"));
        }
    }

    // GET: /api/Medications/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        try
        {
            var med = await _db.Medications.Include(m => m.Schedules).FirstOrDefaultAsync(m => m.Id == id);
            if (med == null)
                return NotFound(EnvelopResponse<string>.Failure("Medicação não encontrada."));

            return Ok(EnvelopResponse<Medication>.Success(med));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao buscar medicação: {ex.Message}"));
        }
    }

    // POST: /api/Medications
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMedicationDto dto)
    {
        try
        {
            var userId =_userContextService.GetUserId();    
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(EnvelopResponse<string>.Failure("Usuário não autenticado."));

            var med = new Medication
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Strength = dto.Strength,
                Notes = dto.Notes,
                UserId = userId

            };
            
            _db.Medications.Add(med);
            await _db.SaveChangesAsync();

            await _publish.Publish(new MedicationCreatedEvent
            {
                MedicationId = med.Id,
                Name = med.Name,
                Strength = med.Strength,
                
                UserId = med.UserId,
                
            });

            return Ok(EnvelopResponse<Medication>.Success(med, "Medicação criada com sucesso."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao criar medicação: {ex.Message}"));
        }
    }

    // PUT: /api/Medications/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMedicationDto dto)
    {
        try
        {
            var med = await _db.Medications.FindAsync(id);
            if (med == null)
                return NotFound(EnvelopResponse<string>.Failure("Medicação não encontrada."));

            med.Name = dto.Name;
            med.Strength = dto.Strength;
            med.Notes = dto.Notes;

            await _db.SaveChangesAsync();
            return Ok(EnvelopResponse<Medication>.Success(med, "Medicação atualizada."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao atualizar medicação: {ex.Message}"));
        }
    }

    // DELETE: /api/Medications/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var med = await _db.Medications.FindAsync(id);
            if (med == null)
                return NotFound(EnvelopResponse<string>.Failure("Medicação não encontrada."));

            _db.Medications.Remove(med);
            await _db.SaveChangesAsync();
            return Ok(EnvelopResponse<string>.Success("Medicação deletada com sucesso."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao deletar medicação: {ex.Message}"));
        }
    }

    // POST: /api/Medications/{medId}/schedule
    [HttpPost("{medId:guid}/schedule")]
    public async Task<IActionResult> AddSchedule(Guid medId, [FromBody] CreateScheduleDto dto)
    {
        try
        {
            var med = await _db.Medications.FindAsync(medId);
            if (med == null)
                return NotFound(EnvelopResponse<string>.Failure("Medicação não encontrada."));

            var schedule = new MedicationSchedule
            {
                Id = Guid.NewGuid(),
                MedicationId = medId,
                TimeOfDay = dto.TimeOfDay,
                Enabled = dto.Enabled
            };

            _db.MedicationSchedules.Add(schedule);
            await _db.SaveChangesAsync();

            await _publish.Publish(new ScheduleCreatedEvent
            {
                ScheduleId = schedule.Id,
                MedicationId = schedule.MedicationId,
                TimeOfDay = DateTime.Now,
                Enabled = schedule.Enabled
            });


            return Ok(EnvelopResponse<MedicationSchedule>.Success(schedule, "Schedule criado."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao criar schedule: {ex.Message}"));
        }
    }

    // POST: /api/Medications/mark-taken/{scheduleId}
    [HttpPost("mark-taken/{scheduleId:guid}")]
    public async Task<IActionResult> MarkTaken(Guid scheduleId)
    {
        try
        {
            string userId = _userContextService.GetUserId(); // ✅ correto

            var schedule = await _db.MedicationHistories.FindAsync(scheduleId);
            if (schedule == null)
                return NotFound(EnvelopResponse<string>.Failure("Schedule não encontrado."));

            schedule.WasTaken = true;
            schedule.TakenAt = DateTime.UtcNow;

            await _db.SaveChangesAsync ();

            await _publish.Publish(new MedicationTakenEvent
            {
               
                MedicationId = schedule.MedicationId,
                UserId = userId,
                TakenAt = schedule.TakenAt ?? DateTime.UtcNow
            });
            return Ok(EnvelopResponse<MedicationHistory>.Success(schedule, "Medicação marcada como tomada."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, EnvelopResponse<string>.Failure($"Erro ao marcar medicação: {ex.Message}"));
        }
    }
}
