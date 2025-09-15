using Application.Commands.MedicationCommand;
using Application.Response;
using Application.Services;
using Domain.Entities;
using Infrastructure.Interface;
using MediatR;
using Shared.Contracts.Events;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Handlers.MedicationHandlers
{
    public class MarkScheduleTakenHandler
        : IRequestHandler<MarkScheduleTakenCommand, EnvelopResponse<MedicationSchedule>>
    {
        private readonly IMedicationRepository _repository;
        private readonly IPublisher _publisher;
        private readonly IUserContextService _userContextService;

        public MarkScheduleTakenHandler(
            IMedicationRepository repository,
            IPublisher publisher,
            IUserContextService userContextService)
        {
            _repository = repository;
            _publisher = publisher;
            _userContextService = userContextService;
        }

        public async Task<EnvelopResponse<MedicationSchedule>> Handle(
            MarkScheduleTakenCommand request,
            CancellationToken cancellationToken)
        {
            // Busca schedule
            var schedule = await _repository.GetScheduleByIdAsync(request.ScheduleId);
            if (schedule == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Schedule não encontrado.");

            var userId = _userContextService.GetUserId();
            var email = _userContextService.GetUserEmail();

            // Validação do usuário
            if (schedule.UserId != request.UserId)
                return EnvelopResponse<MedicationSchedule>.Failure("Usuário não autorizado para esta medicação.");

            // Checa se já foi marcado
            if (schedule.Enabled == false)
                return EnvelopResponse<MedicationSchedule>.Failure("Medicação já marcada como tomada ou desabilitada.");

            // Marca como tomado (ex: desabilita para o dia)
            schedule.Enabled = false;

            // Atualiza no banco
            var updated = await _repository.UpdateScheduleAsync(schedule);
            if (updated == null)
                return EnvelopResponse<MedicationSchedule>.Failure("Falha ao atualizar schedule da medicação.");

            // Publica evento
            await _publisher.Publish(new MedicationTakenEvent
            {
                MedicationId = updated.MedicationId,
                UserId = userId,
                TakenAt = DateTime.UtcNow,
                Email = email // 👈 agora vai o email do usuário logado
            }, cancellationToken);

            return EnvelopResponse<MedicationSchedule>.Success(
                updated,
                "Medicação marcada como tomada com sucesso!"
            );
        }
    }
}
