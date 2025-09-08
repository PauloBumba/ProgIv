using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;
using MediatR;
namespace Application.Commands
{
    

    
        public record UpdateUserCommand(
            string UserId,
            string? FullName = null,
            string? Email = null,
            string? PhoneNumber = null,
            Sex? Sex = null,
            string? Role = null
        ) : IRequest<UserEntities>;
    



}
