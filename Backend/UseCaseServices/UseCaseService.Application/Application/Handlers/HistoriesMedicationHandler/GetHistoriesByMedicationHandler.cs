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

namespace Application.Handlers.HistoriesMedicationHandler
{
    public class GetHistoriesByMedicationHandler : IRequestHandler<GetHistoriesByMedicationQuery, EnvelopResponse<List<MedicationHistory>>>
    {
        private readonly IMedicationRepository _repository;

        public GetHistoriesByMedicationHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<List<MedicationHistory>>> Handle(
    GetHistoriesByMedicationQuery request,
    CancellationToken cancellationToken)
        {
            try
            {
                // converte IEnumerable em List
                var histories = (await _repository.GetHistoriesByMedicationIdAsync(request.MedicationId)).ToList();

                if (!histories.Any())
                    return EnvelopResponse<List<MedicationHistory>>.Failure("Nenhum histórico encontrado para este medicamento.");

                return EnvelopResponse<List<MedicationHistory>>.Success(histories);
            }
            catch (System.Exception ex)
            {
                return EnvelopResponse<List<MedicationHistory>>.Failure($"Erro ao buscar histórico: {ex.Message}");
            }
        }

    }
}
