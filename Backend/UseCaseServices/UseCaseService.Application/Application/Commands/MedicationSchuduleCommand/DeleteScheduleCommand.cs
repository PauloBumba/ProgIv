using Application.Response;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.MedicationSchuduleCommand
{
    public class DeleteScheduleCommand : IRequest<EnvelopResponse<string>>
    {
        public long ScheduleId { get; }

        public DeleteScheduleCommand(long scheduleId)
        {
            ScheduleId = scheduleId;
        }
    }
}
