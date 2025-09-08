using Application.Queries;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Handlers
{
    
        public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserEntities>
        {
            private readonly UserManager<UserEntities> _userManager;

            public GetUserByIdHandler(UserManager<UserEntities> userManager)
            {
                _userManager = userManager;
            }

            public async Task<UserEntities> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
            {
               var UserId = await _userManager.FindByIdAsync(request.UserId);
                return UserId;

            }
        }
}
