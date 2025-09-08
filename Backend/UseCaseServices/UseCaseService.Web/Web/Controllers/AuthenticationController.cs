using Application.Dto;
using Application.Interface;
using Application.Response;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Web.Helpers;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthentication _authentication;

        public AuthenticationController(IAuthentication authentication)
        {
            _authentication = authentication;
        }

        [HttpPost("login")]
       
        public async Task<ActionResult<EnvelopResponse<string>>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var response = await _authentication.Login(loginDto);

                if (!response.isSuccess)
                    return BadRequest(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                var error = ServiceHelper.HandleException<string>(ex, "Erro ao realizar login.");
                return BadRequest(error);
            }
        }

        [HttpPost("logout")]
        public async Task<ActionResult<EnvelopResponse<string>>> Logout()
        {
            try
            {
                var response = await _authentication.Logout();
                return Ok(response);
            }
            catch (Exception ex)
            {
                var error = ServiceHelper.HandleException<string>(ex, "Erro ao realizar logout.");
                return BadRequest(error);
            }
        }

    }
}
