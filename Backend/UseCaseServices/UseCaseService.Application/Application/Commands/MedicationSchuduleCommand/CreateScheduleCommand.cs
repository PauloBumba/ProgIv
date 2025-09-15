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
        long MedicationId,
        TimeSpan TimeOfDay,
        bool Enabled,
        int RepeatIntervalDays,
        DateTime? StartDate,
        DateTime? EndDate,
        string UserId
    ) : IRequest<EnvelopResponse<MedicationSchedule>>;

}
