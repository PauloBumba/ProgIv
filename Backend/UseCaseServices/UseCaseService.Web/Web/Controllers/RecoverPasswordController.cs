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
    public class RecoverPasswordController : ControllerBase
    {
        private readonly IRecoverPassword _services;

        public RecoverPasswordController(IRecoverPassword services)
        {
            _services = services;
        }

        [HttpPost("reset")]
        public async Task<IActionResult> SendResetCode([FromBody] ForgotPasswordDto forgotPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _services.SendCodeByEmail(forgotPassword);
                return Ok(response);
            }
            catch (Exception ex)
            {
                var error = ServiceHelper.HandleException<object>(ex, "Erro ao enviar código de recuperação.");
                return BadRequest(error);
            }
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateCode([FromBody] ValidateCodeDto validate)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _services.ValidateCodeByEmail(validate);
                return Ok(response);
            }
            catch (Exception ex)
            {
                var error = ServiceHelper.HandleException<object>(ex, "Erro ao validar código.");
                return BadRequest(error);
            }
        }

        [HttpPost("recover")]
        public async Task<IActionResult> RecoverPassword([FromBody] RecoverPassswordDto recover)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _services.RecoverPassword(recover);
                return Ok(response);
            }
            catch (Exception ex)
            {
                var error = ServiceHelper.HandleException<object>(ex, "Erro ao recuperar senha.");
                return BadRequest(error);
            }
        }
    }
}
