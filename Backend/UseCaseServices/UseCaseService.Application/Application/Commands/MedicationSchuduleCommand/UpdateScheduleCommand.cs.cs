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
    
        public class UpdateScheduleCommand : IRequest<EnvelopResponse<MedicationSchedule>>
        {
            public long ScheduleId { get; }
            public TimeSpan TimeOfDay { get; }
            public bool Enabled { get; }
            public int RepeatIntervalDays { get; }
            public DateTime StartDate { get; }
            public DateTime? EndDate { get; }

            public UpdateScheduleCommand(
                long scheduleId,
                TimeSpan timeOfDay,
                bool enabled,
                int repeatIntervalDays,
                DateTime startDate,
                DateTime? endDate)
            {
                ScheduleId = scheduleId;
                TimeOfDay = timeOfDay;
                Enabled = enabled;
                RepeatIntervalDays = repeatIntervalDays;
                StartDate = startDate;
                EndDate = endDate;
            }
        }
    }

