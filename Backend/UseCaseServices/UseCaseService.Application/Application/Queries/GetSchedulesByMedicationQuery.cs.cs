using Application.Response;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries
{
    public class GetSchedulesByMedicationQuery : IRequest<EnvelopResponse<List<MedicationSchedule>>>
    {
        public Guid MedicationId { get; }

        public GetSchedulesByMedicationQuery(Guid medicationId)
        {
            MedicationId = medicationId;
        }
    }
}
