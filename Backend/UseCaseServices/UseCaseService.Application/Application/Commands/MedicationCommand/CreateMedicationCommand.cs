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
    public record CreateMedicationCommand(
     string Name,
     string Strength,
     string? Notes,
     string UserId
 ) : IRequest<EnvelopResponse<Medication>>;


}
