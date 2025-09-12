using Application.Commands.MedicationCommand;
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
    public class DeleteMedicationHandler : IRequestHandler<DeleteMedicationCommand, EnvelopResponse<string>>
    {
        private readonly IMedicationRepository _repository;

        public DeleteMedicationHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<string>> Handle(DeleteMedicationCommand request, CancellationToken cancellationToken)
        {
            var medication = await _repository.GetMedicationByIdAsync(request.MedicationId);
            if (medication == null)
                return EnvelopResponse<string>.Failure("Medicamento não encontrado.");

            var deleted = await _repository.DeleteMedicationAsync(request.MedicationId);
            if (!deleted)
                return EnvelopResponse<string>.Failure("Falha ao deletar medicamento.");

            return EnvelopResponse<string>.Success("Medicamento deletado com sucesso!");
        }
    }

}
