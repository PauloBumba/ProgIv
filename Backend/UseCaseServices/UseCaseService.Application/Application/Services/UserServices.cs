using Application.Commands;
using Application.Dto;
using Application.Interface;
using Application.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using global::Application.Mappers;
using global::Application.Response;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Application.Services
{
    
    

    namespace Application.Services
    {
        public class UserService : IUserServices
        {
            private readonly IMediator _mediator;

            public UserService(IMediator mediator)
            {
                _mediator = mediator;
            }

            public async Task<EnvelopResponse<string>> CreateUserAsync(CreateUserCommand command)
            {
                try
                {
                    var user = await _mediator.Send(command);
                    if (user == null)
                    {
                        return new EnvelopResponse<string>
                        {
                            isSuccess = false,
                            Message = "Erro ao criar usuário.",
                            Data = null
                        };
                    }

                    // Retorna o Id ou algum identificador (pode mudar pra nome ou email se preferir)
                    return new EnvelopResponse<string>
                    {
                        isSuccess = true,
                        Message = "Usuário criado com sucesso.",
                        Data = user.Id
                    };
                }
                catch (Exception ex)
                {
                    return new EnvelopResponse<string>
                    {
                        isSuccess = false,
                        Message = $"Erro inesperado: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<EnvelopResponse<string>> UpdateUserAsync(UpdateUserCommand command)
            {
                try
                {
                    var user = await _mediator.Send(command);
                    if (user == null)
                    {
                        return new EnvelopResponse<string>
                        {
                            isSuccess = false,
                            Message = "Usuário não encontrado ou erro ao atualizar.",
                            Data = null
                        };
                    }

                    // Retorna Id atualizado como confirmação
                    return new EnvelopResponse<string>
                    {
                        isSuccess = true,
                        Message = "Usuário atualizado com sucesso.",
                        Data = user.Id
                    };
                }
                catch (Exception ex)
                {
                    return new EnvelopResponse<string>
                    {
                        isSuccess = false,
                        Message = $"Erro inesperado: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<EnvelopResponse<bool>> DeleteUserAsync(DeleteUserCommand command)
            {
                try
                {
                    var result = await _mediator.Send(command);
                    if (result==null)
                    {
                        return new EnvelopResponse<bool>
                        {
                            isSuccess = false,
                            Message = "Usuário não encontrado ou erro ao deletar.",
                            Data = false
                        };
                    }

                    return new EnvelopResponse<bool>
                    {
                        isSuccess = true,
                        Message = "Usuário deletado com sucesso.",
                        Data = true
                    };
                }
                catch (Exception ex)
                {
                    return new EnvelopResponse<bool>
                    {
                        isSuccess = false,
                        Message = $"Erro inesperado: {ex.Message}",
                        Data = false
                    };
                }
            }

            public async Task<EnvelopResponse<IEnumerable<UserDto>>> GetAllUsersAsync(GetAllUsersQuery query)
            {
                try
                {
                    var users = await _mediator.Send(query);
                    if (users == null || !users.Any())
                    {
                        return new EnvelopResponse<IEnumerable<UserDto>>
                        {
                            isSuccess = false,
                            Message = "Nenhum usuário encontrado.",
                            Data = null
                        };
                    }

                    return new EnvelopResponse<IEnumerable<UserDto>>
                    {
                        isSuccess = true,
                        Message = "Lista de usuários obtida com sucesso.",
                        Data = users.Select(u => u.ToDto())
                    };
                }
                catch (Exception ex)
                {
                    return new EnvelopResponse<IEnumerable<UserDto>>
                    {
                        isSuccess = false,
                        Message = $"Erro inesperado: {ex.Message}",
                        Data = null
                    };
                }
            }

            public async Task<EnvelopResponse<UserDto>> GetUserByIdAsync(GetUserByIdQuery query)
            {
                try
                {
                    var user = await _mediator.Send(query);
                    if (user == null)
                    {
                        return new EnvelopResponse<UserDto>
                        {
                            isSuccess = false,
                            Message = "Usuário não encontrado.",
                            Data = null
                        };
                    }

                    return new EnvelopResponse<UserDto>
                    {
                        isSuccess = true,
                        Message = "Usuário encontrado com sucesso.",
                        Data = user.ToDto()
                    };
                }
                catch (Exception ex)
                {
                    return new EnvelopResponse<UserDto>
                    {
                        isSuccess = false,
                        Message = $"Erro inesperado: {ex.Message}",
                        Data = null
                    };
                }
            }
        }
    }

}
