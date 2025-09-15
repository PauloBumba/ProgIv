using Application.Commands;
using Application.Dto;
using Application.Interface;
using Application.Mappers;
using Application.Queries;
using Application.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Helpers;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userService;

        public UserController(IUserServices userService)
        {
            _userService = userService;
        }

        // ================= CREATE =================
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

        // ================= UPDATE =================
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto updateUserDto)
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

        // ================= DELETE =================
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var command = new DeleteUserCommand(id.ToString());
                var response = await _userService.DeleteUserAsync(command);

                if (!response.isSuccess)
                    return NotFound(EnvelopResponse<bool>.Failure(response.Message ?? "Usuário não encontrado."));

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = ServiceHelper.HandleException<bool>(ex, "Erro ao deletar usuário.");
                return StatusCode(500, errorResponse);
            }
        }

        // ================= GET ALL =================
        [Authorize]
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

        // ================= GET BY ID =================
        [Authorize]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            try
            {
                var query = new GetUserByIdQuery(id.ToString());
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
