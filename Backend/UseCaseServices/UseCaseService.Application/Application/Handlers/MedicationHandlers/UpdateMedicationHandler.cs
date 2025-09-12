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
    public class UpdateMedicationHandler : IRequestHandler<UpdateMedicationCommand, EnvelopResponse<Medication>>
    {
        private readonly IMedicationRepository _repository;

        public UpdateMedicationHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<Medication>> Handle(UpdateMedicationCommand request, CancellationToken cancellationToken)
        {
            var existing = await _repository.GetMedicationByIdAsync(request.Id);
            if (existing == null)
                return EnvelopResponse<Medication>.Failure("Medicamento não encontrado.");

            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Strength))
                return EnvelopResponse<Medication>.Failure("Nome ou força do medicamento inválidos.");

            existing.Name = request.Name;
            existing.Strength = request.Strength;
            existing.Notes = request.Notes;

            var updated = await _repository.UpdateMedicationAsync(existing);
            return EnvelopResponse<Medication>.Success(updated, "Medicamento atualizado com sucesso!");
        }
    }
}
