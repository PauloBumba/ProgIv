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
    public class GetHistoriesByMedicationQuery : IRequest<EnvelopResponse<List<MedicationHistory>>>
    {
        public long MedicationId { get; }

        public GetHistoriesByMedicationQuery(long medicationId)
        {
            MedicationId = medicationId;
        }
    }
}
