using Application.Commands.MedicationSchuduleCommand;
using Application.Response;
using Domain.Entities;
using Infrastructure.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Handlers.SchuduleMedicationHandlers
{
    public class UpdateScheduleHandler : IRequestHandler<UpdateScheduleCommand, EnvelopResponse<MedicationSchedule>>
    {
        private readonly IMedicationRepository _repository;

        public UpdateScheduleHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<MedicationSchedule>> Handle(UpdateScheduleCommand request, CancellationToken cancellationToken)
        {
            var schedule = await _repository.GetScheduleByIdAsync(request.ScheduleId);
            if (schedule == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Agendamento não encontrado.");

            // Atualiza apenas campos importantes
            schedule.TimeOfDay = request.TimeOfDay;
            schedule.Enabled = request.Enabled;
            schedule.RepeatIntervalDays = request.RepeatIntervalDays > 0 ? request.RepeatIntervalDays : 1;
            schedule.StartDate = request.StartDate;
            schedule.EndDate = request.EndDate;

            var result = await _repository.UpdateScheduleAsync(schedule);
            if (result == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Falha ao atualizar o agendamento.");

            return EnvelopResponse<MedicationSchedule>.Success(result, "Agendamento atualizado com sucesso!");
        }
    }
}
