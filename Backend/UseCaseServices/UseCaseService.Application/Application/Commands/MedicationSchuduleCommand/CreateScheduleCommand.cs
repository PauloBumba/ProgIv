using Application.Response;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.MedicationSchuduleCommand
{
    public record CreateScheduleCommand(
        Guid MedicationId,
        TimeSpan TimeOfDay,
        bool Enabled,
        int RepeatIntervalDays,
        DateTime? StartDate,
        DateTime? EndDate
    ) : IRequest<EnvelopResponse<MedicationSchedule>>;

}
