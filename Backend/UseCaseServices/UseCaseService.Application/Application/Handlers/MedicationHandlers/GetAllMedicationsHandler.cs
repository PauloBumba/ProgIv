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

namespace Application.Handlers.MedicationHandlers
{
    public class GetAllMedicationsHandler : IRequestHandler<GetAllMedicationsQuery, EnvelopResponse<IEnumerable<Medication>>>
    {
        private readonly IMedicationRepository _repository;

        public GetAllMedicationsHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<IEnumerable<Medication>>> Handle(GetAllMedicationsQuery request, CancellationToken cancellationToken)
        {
            var medications = await _repository.GetAllMedicationsAsync();
            return EnvelopResponse<IEnumerable<Medication>>.Success(medications, "Lista de medicamentos carregada com sucesso!");
        }
    }
}
