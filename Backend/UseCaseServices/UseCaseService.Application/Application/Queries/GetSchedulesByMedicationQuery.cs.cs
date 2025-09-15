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
        public long MedicationId { get; }

        public GetSchedulesByMedicationQuery(long medicationId)
        {
            MedicationId = medicationId;
        }
    }
}
