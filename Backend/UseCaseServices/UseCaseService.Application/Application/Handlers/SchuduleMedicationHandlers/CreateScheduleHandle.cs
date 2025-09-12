using Application.Commands.MedicationCommand;
using Application.Response;
using Domain.Entities;
using Infrastructure.Interface;
using MediatR;
using Shared.Contracts.Events;
using MassTransit;
using Application.Commands.MedicationSchuduleCommand;

namespace Application.Handlers.MedicationHandlers
{
    public class AddScheduleHandler : IRequestHandler<CreateScheduleCommand, EnvelopResponse<MedicationSchedule>>
    {
        private readonly IMedicationRepository _repository;
        private readonly IPublishEndpoint _publish;

        public AddScheduleHandler(IMedicationRepository repository, IPublishEndpoint publish)
        {
            _repository = repository;
            _publish = publish;
        }

        public async Task<EnvelopResponse<MedicationSchedule>> Handle(CreateScheduleCommand request, CancellationToken cancellationToken)
        {
            // validação básica
            if (request.MedicationId == Guid.Empty)
                return EnvelopResponse<MedicationSchedule>.Failure("Id do medicamento inválido.");

            if (request.TimeOfDay == default)
                return EnvelopResponse<MedicationSchedule>.Failure("Horário inválido.");

            // Verifica se o medicamento existe
            var med = await _repository.GetMedicationByIdAsync(request.MedicationId);
            if (med == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Medicamento não encontrado.");

            // Criação do schedule
            var schedule = new MedicationSchedule
            {
                Id = Guid.NewGuid(),
                MedicationId = request.MedicationId,
                TimeOfDay = request.TimeOfDay,
                RepeatIntervalDays = request.RepeatIntervalDays > 0 ? request.RepeatIntervalDays : 1,
                Enabled = true,
                StartDate = request.StartDate,
                EndDate = request.EndDate
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
                EndDate = result.EndDate
            });

            return EnvelopResponse<MedicationSchedule>.Success(result, "Agendamento criado com sucesso!");
        }
    }
}
