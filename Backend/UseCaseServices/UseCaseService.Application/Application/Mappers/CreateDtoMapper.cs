using Application.Commands;
using Application.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappers
{
    public static class CreateDtoMapper
    {
        public static CreateUserCommand ToCommand(this RegisterDto dto)
        {
            return new CreateUserCommand(
                dto.FullName,
                dto.Email,
                dto.Password,
                dto.ConfirmPassword,
                dto.DateOfBirth,
                dto.PhoneNumber,
                dto.Sex,
                dto.CPF,
                dto.Addresses,
                dto.Role.ToString()
               
            );
        }

    }
}
