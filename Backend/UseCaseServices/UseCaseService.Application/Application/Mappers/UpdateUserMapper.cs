using Application.Commands;
using Application.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappers
{
    public static class UpdateUserDtoMapper
    {
        public static UpdateUserCommand ToCommand(this UpdateUserDto dto)
        {
            return new UpdateUserCommand(
                dto.UserId,
                dto.FullName,
                dto.Email,
                dto.PhoneNumber,
                dto.Sex,
                dto.Role
            );
        }
    }
}
