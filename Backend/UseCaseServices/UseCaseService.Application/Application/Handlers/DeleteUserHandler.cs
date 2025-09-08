using Application.Commands;
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
    public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, UserEntities>
    {
        private readonly UserManager<UserEntities> _userManager;

        public DeleteUserHandler(UserManager<UserEntities> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserEntities> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
                return null; // usuário não encontrado

            var result = await _userManager.DeleteAsync(user);
            

            return user;
        }
    }
}
