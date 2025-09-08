using Application.Commands;

using Application.Dto;
using Application.Interface;
using Application.Mappers;
using Application.Queries;
using Application.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Helpers;
using static Domain.Constants.RoleConstants;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userService;

        public UserController(IUserServices userService)
        {
            _userService = userService;
        }

        
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateUser([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var command = registerDto.ToCommand();
                var response = await _userService.CreateUserAsync(command);

                if (!response.isSuccess)
                    return BadRequest(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = ServiceHelper.HandleException<string>(ex, "Erro ao criar usuário.");
                return StatusCode(500, errorResponse);
            }
        }

     
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var command = updateUserDto.ToCommand();
                var response = await _userService.UpdateUserAsync(command);

                if (!response.isSuccess)
                    return BadRequest(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = ServiceHelper.HandleException<string>(ex, "Erro ao atualizar usuário.");
                return StatusCode(500, errorResponse);
            }
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(DeleteUserDto deleteUserDto)
        {
            try
            {
                var command = deleteUserDto.ToCommand();
                var response = await _userService.DeleteUserAsync(command);

                if (!response.isSuccess)
                    return BadRequest(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = ServiceHelper.HandleException<string>(ex, "Erro ao deletar usuário.");
                return StatusCode(500, errorResponse);
            }
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var query = new GetAllUsersQuery();
                var response = await _userService.GetAllUsersAsync(query);

                if (!response.isSuccess)
                    return NotFound(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = ServiceHelper.HandleException<string>(ex, "Erro ao listar usuários.");
                return StatusCode(500, errorResponse);
            }
        }

     
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var query = new GetUserByIdQuery(id);
                var response = await _userService.GetUserByIdAsync(query);

                if (!response.isSuccess)
                    return NotFound(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = ServiceHelper.HandleException<string>(ex, "Erro ao buscar usuário.");
                return StatusCode(500, errorResponse);
            }
        }
    }
}
