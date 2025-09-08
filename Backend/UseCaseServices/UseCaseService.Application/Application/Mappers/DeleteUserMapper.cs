using Application.Commands;
using Application.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappers
{
    
        public static class DeleteUserDtoMapper
        {
            public static DeleteUserCommand ToCommand(this DeleteUserDto dto)
            {
                return new DeleteUserCommand(dto.UserId);
            }
        }
    
}
