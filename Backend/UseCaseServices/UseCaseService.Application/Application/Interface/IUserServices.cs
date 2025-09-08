using Application.Commands;
using Application.Dto;
using Application.Queries;
using Application.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    
        public interface IUserServices
        {
         Task<EnvelopResponse<string>> CreateUserAsync(CreateUserCommand command);
        Task<EnvelopResponse<string>> UpdateUserAsync(UpdateUserCommand command);
        Task<EnvelopResponse<bool>> DeleteUserAsync(DeleteUserCommand command);
        Task<EnvelopResponse<IEnumerable<UserDto>>> GetAllUsersAsync(GetAllUsersQuery query);
        Task<EnvelopResponse<UserDto>> GetUserByIdAsync(GetUserByIdQuery query);

    }

}
