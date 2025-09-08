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
      
     public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserEntities>
     {
            private readonly UserManager<UserEntities> _userManager;
            private readonly RoleManager<IdentityRole> _roleManager;

            public UpdateUserHandler(UserManager<UserEntities> userManager, RoleManager<IdentityRole> roleManager)
            {
                _userManager = userManager;
                _roleManager = roleManager;
            }

            public async Task<UserEntities> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByIdAsync(request.UserId);
                if (user == null)
                    return null; // ou lança exceção, como preferir

                if (!string.IsNullOrWhiteSpace(request.FullName))
                    user.FullName = request.FullName;

                if (!string.IsNullOrWhiteSpace(request.Email) && user.Email != request.Email)
                {
                    var existingUser = await _userManager.FindByEmailAsync(request.Email);
                    if (existingUser != null && existingUser.Id != user.Id)
                        return null; // email já em uso

                    user.Email = request.Email;
                   
                }

                if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
                    user.PhoneNumber = request.PhoneNumber;

                if (request.Sex.HasValue)
                    user.Sex = request.Sex.Value;

                if (!string.IsNullOrWhiteSpace(request.Role))
                {
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    if (!currentRoles.Contains(request.Role))
                    {
                        await _userManager.RemoveFromRolesAsync(user, currentRoles);

                        if (!await _roleManager.RoleExistsAsync(request.Role))
                            await _roleManager.CreateAsync(new IdentityRole(request.Role));

                        await _userManager.AddToRoleAsync(user, request.Role);
                    }
                }

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                    return null; // ou trate o erro de forma detalhada

                return user;
            }
        }
    }


