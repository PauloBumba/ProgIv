using Application.Queries;
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
    public class GetSchedulesByMedicationHandler : IRequestHandler<GetSchedulesByMedicationQuery, EnvelopResponse<List<MedicationSchedule>>>
    {
        private readonly IMedicationRepository _repository;

        public GetSchedulesByMedicationHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<List<MedicationSchedule>>> Handle(GetSchedulesByMedicationQuery request, CancellationToken cancellationToken)
        {
            var schedules = await _repository.GetSchedulesByMedicationIdAsync(request.MedicationId);
            return EnvelopResponse<List<MedicationSchedule>>.Success(schedules.ToList());
        }
    }
}
