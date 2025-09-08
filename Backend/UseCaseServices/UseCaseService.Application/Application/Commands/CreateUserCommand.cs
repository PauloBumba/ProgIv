using Application.Dto;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands
{
   public record CreateUserCommand(
        string FullName,
        string Email,
        string Password,
        string ConfirmPassword,
        DateTime DateOfBirth,
        string PhoneNumber,
        Sex Sex,
        string CPF,
        
        List<AdressDto> Addresses,
        string Role
      
    ) : IRequest<UserEntities>;
}
