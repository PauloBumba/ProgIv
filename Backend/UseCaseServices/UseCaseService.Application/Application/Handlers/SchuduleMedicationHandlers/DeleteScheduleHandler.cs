using Application.Commands.MedicationSchuduleCommand;
using Application.Response;
using Infrastructure.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Handlers.SchuduleMedicationHandlers
{
    public class DeleteScheduleHandler : IRequestHandler<DeleteScheduleCommand, EnvelopResponse<string>>
    {
        private readonly IMedicationRepository _repository;

        public DeleteScheduleHandler(IMedicationRepository repository)
        {
            _repository = repository;
        }

        public async Task<EnvelopResponse<string>> Handle(DeleteScheduleCommand request, CancellationToken cancellationToken)
        {
            var deleted = await _repository.DeleteScheduleAsync(request.ScheduleId);
            return deleted
                ? EnvelopResponse<string>.Success("Schedule deletado com sucesso.")
                : EnvelopResponse<string>.Failure("Schedule não encontrado.");
        }
    }
}
