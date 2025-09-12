using Application.Response;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.MedicationCommand
{
    public record MarkScheduleTakenCommand(
        Guid ScheduleId,
        string UserId
    ) : IRequest<EnvelopResponse<MedicationSchedule>>;
}

