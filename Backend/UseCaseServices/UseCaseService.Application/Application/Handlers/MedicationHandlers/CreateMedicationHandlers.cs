using Application.Commands.MedicationCommand;
using Application.Response;
using Domain.Entities;
using Infrastructure.Interface;
using MediatR;
using Shared.Contracts.Events;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Application.Services;

namespace Application.Handlers.MedicationHandlers
{
    public class CreateMedicationHandler : IRequestHandler<CreateMedicationCommand, EnvelopResponse<Medication>>
    {
        private readonly IMedicationRepository _repository;
        private readonly IPublishEndpoint _publish; // ✅ MassTransit
        private readonly IUserContextService _userContextService;

        public CreateMedicationHandler(IMedicationRepository repository, IPublishEndpoint publish, IUserContextService userContext)
        {
            _repository = repository;
            _publish = publish;
            _userContextService = userContext;
        }

        public async Task<EnvelopResponse<Medication>> Handle(CreateMedicationCommand request, CancellationToken cancellationToken)
        {
            // Validação básica
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Strength))
                return EnvelopResponse<Medication>.Failure("Nome ou força do medicamento inválidos.");

            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return EnvelopResponse<Medication>.Failure("Usuário não autenticado.");

            if (request.Name.Length > 100 || request.Strength.Length > 50)
                return EnvelopResponse<Medication>.Failure("Nome ou força excedem o tamanho máximo.");

            if (!string.IsNullOrWhiteSpace(request.Notes) && request.Notes.Length > 500)
                return EnvelopResponse<Medication>.Failure("Notas excedem o tamanho máximo.");

            // Verifica se já existe medicamento com o mesmo nome
            var existingMedication = await _repository.GetAllMedicationsAsync();
            if (existingMedication == null)
                return EnvelopResponse<Medication>.Failure("Falha ao consultar medicamentos.");

            if (existingMedication.Any(m => m.Name.Equals(request.Name, StringComparison.OrdinalIgnoreCase)))
                return EnvelopResponse<Medication>.Failure("Medicamento com esse nome já existe.");

            // Criação da entidade
            var medication = new Medication
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Strength = request.Strength,
                Notes = request.Notes,
                UserId = userId,
                CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo"))
            };

            var result = await _repository.AddMedicationAsync(medication);
            if (result == null)
                return EnvelopResponse<Medication>.Failure("Falha ao criar medicamento.");

            // Publica evento de integração
            await _publish.Publish(new MedicationCreatedEvent
            {
                MedicationId = medication.Id,
                Name = medication.Name,
                Strength = medication.Strength,
                UserId = medication.UserId
            }, cancellationToken);

            return EnvelopResponse<Medication>.Success(result, "Medicamento criado com sucesso!");
        }
    }
}
