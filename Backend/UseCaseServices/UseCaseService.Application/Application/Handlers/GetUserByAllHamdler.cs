using Application.Queries;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Handlers
{
    
        public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<UserEntities>>
        {
            private readonly UserManager<UserEntities> _userManager;

            public GetAllUsersHandler(UserManager<UserEntities> userManager)
            {
                _userManager = userManager;
            }

            public async Task<List<UserEntities>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
            {
                
                return await _userManager.Users.ToListAsync(cancellationToken);
            }
        }
    }

