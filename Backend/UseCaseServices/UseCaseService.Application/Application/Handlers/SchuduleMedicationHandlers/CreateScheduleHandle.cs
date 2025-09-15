using Application.Commands.MedicationCommand;
using Application.Commands.MedicationSchuduleCommand;
using Application.Response;
using Application.Services;
using Domain.Entities;
using Infrastructure.Interface;
using MassTransit;
using MediatR;
using Shared.Contracts.Events;

namespace Application.Handlers.MedicationHandlers
{
    public class AddScheduleHandler : IRequestHandler<CreateScheduleCommand, EnvelopResponse<MedicationSchedule>>
    {
        private readonly IMedicationRepository _repository;
        private readonly IPublishEndpoint _publish;
        private readonly IUserContextService _userContextService;
        public AddScheduleHandler(IMedicationRepository repository, IPublishEndpoint publish, IUserContextService userContextService)
        {
            _repository = repository;
            _publish = publish;
            _userContextService = userContextService;
        }

        public async Task<EnvelopResponse<MedicationSchedule>> Handle(CreateScheduleCommand request, CancellationToken cancellationToken)
        {
            // validação básica
            var userId = _userContextService.GetUserId();
            var email = _userContextService.GetUserEmail();


            if (request.TimeOfDay == default)
                return EnvelopResponse<MedicationSchedule>.Failure("Horário inválido.");

            // Verifica se o medicamento existe
            var med = await _repository.GetMedicationByIdAsync(request.MedicationId);
            if (med == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Medicamento não encontrado.");

            // Criação do schedule
            var schedule = new MedicationSchedule
            {
                
                MedicationId = request.MedicationId,
                TimeOfDay = request.TimeOfDay,
                RepeatIntervalDays = request.RepeatIntervalDays > 0 ? request.RepeatIntervalDays : 1,
                Enabled = true,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                UserId = request.UserId
            };

            var result = await _repository.AddMedicationScheduleAsync(schedule);
            if (result == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Falha ao criar o agendamento.");

            // Publica evento
            await _publish.Publish(new MedicationScheduleCreatedEvent
            {
                ScheduleId = result.Id,
                MedicationId = result.MedicationId,
                TimeOfDay = result.TimeOfDay,
                Enabled=result.Enabled,
                RepeatIntervalDays = result.RepeatIntervalDays,
                StartDate = result.StartDate,
                EndDate = result.EndDate,
                UserId = userId,
              
                Email = email // 👈
            });

            return EnvelopResponse<MedicationSchedule>.Success(result, "Agendamento criado com sucesso!");
        }
    }
}
