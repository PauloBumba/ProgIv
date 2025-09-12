using Application.Queries;
using Domain.Entities;
using Infrastructure.Interface;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Handlers.MedicationHandlers
{
    public class GetMedicationByIdHandler : IRequestHandler<GetMedicationByIdQuery, Medication>
    {
        private readonly IMedicationRepository _repository;

        public GetMedicationByIdHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<Medication> Handle(GetMedicationByIdQuery request, CancellationToken cancellationToken)
        {
            var medication = await _repository.GetMedicationByIdAsync(request.Id);
            return medication; // pode ser null se não encontrar
        }
    }
}
