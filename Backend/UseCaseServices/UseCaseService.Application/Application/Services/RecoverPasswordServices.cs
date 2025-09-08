using Application.Dto;
using Application.Interface;
using Application.Response;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MassTransit;

using Shared.Contracts.Events; 

namespace Application.Services
{

    public class RecoverPasswordServices : IRecoverPassword
    {
        private readonly UserManager<UserEntities> _userManager;
        private readonly UserCaseDbContext _context;
        private readonly ISendEmails _sendEmail;
        private readonly IPublishEndpoint _publishEndpoint;
        public RecoverPasswordServices(UserManager<UserEntities> userManager, UserCaseDbContext context, ISendEmails sendEmail, IPublishEndpoint publishEndpoint)
    {
      _userManager = userManager;
      _context = context;
      _sendEmail = sendEmail;
            _publishEndpoint = publishEndpoint;
        }

        public async Task<EnvelopResponse<string>> RecoverPassword(RecoverPassswordDto recover)
        {
            var user = await _userManager.FindByEmailAsync(recover.Email);

            if (user == null)
            {
                return new EnvelopResponse<string>
                {
                    Message = "Conta não Cadastrada ",
                    isSuccess = false,
                    Data = null
                };
            }

            var reset = await _userManager.ResetPasswordAsync(user, recover.Token, recover.password);
            if (!reset.Succeeded)
            {
                var error = string.Join(",", reset.Errors.Select(d => d.Description));
                return new EnvelopResponse<string>
                {
                    Message = error,
                    isSuccess = false,
                    Data = error
                };
            }
            return new EnvelopResponse<string>
            {
                Message = "Senha Refinida Com Sucesso",
                Data = null,
                isSuccess = true,
            };
        }

        public async Task<EnvelopResponse<string>> SendCodeByEmail(ForgotPasswordDto request)
{
    var user = await _userManager.FindByEmailAsync(request.Email);
    if (user == null)
    {
        return new EnvelopResponse<string>
        {
            Message = "Conta não Cadastrada ",
            isSuccess = false,
            Data = null
        };
    }

    var code = new GenerateCode();
    var passwordCodeReset = new PasswordResetCode
    {
        UserId = user.Id,
        Used = false,
        Expiration = DateTime.UtcNow.AddMinutes(30),
        Code = code.GenerateCodeRecuperation()
    };

    await _context.AddAsync(passwordCodeReset);
    await _context.SaveChangesAsync();

    // Publica o evento para o microserviço de Notificação
    await _publishEndpoint.Publish(new PasswordRecoveryRequestedEvent
    {
        Email = user.Email,
        FullName = user.FullName,
        Code = passwordCodeReset.Code ,
        CreateTime = DateTime.UtcNow 
    },context =>
    {
        context.Durable = true;
    });

    return new EnvelopResponse<string>()
    {
        Message = $"Olá {user.FullName}, código enviado pelo email",
        Data = passwordCodeReset.Code,
        isSuccess = true,
    };
}


        public async Task<EnvelopResponse<string>> ValidateCodeByEmail(ValidateCodeDto validate)
        {
            var user = await _userManager.FindByEmailAsync(validate.Email);
            if (user == null)
            {
                return new EnvelopResponse<string>
                {
                    Message = "O Email deve estar cadastrado para validar o código.",
                    Data = null,
                    isSuccess = false
                };
            }

            var codigoSalvo = await _context.PasswordReset
                .Where(c => c.UserId == user.Id && c.Code == validate.Code && !c.Used && c.Expiration > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (codigoSalvo == null)
            {
                return new EnvelopResponse<string>
                {
                    Message = "Código expirado ou inválido, clique no botão para obter um novo código.",
                    Data = null,
                    isSuccess = false
                };
            }

            codigoSalvo.Used = true;
            await _context.SaveChangesAsync();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            return new EnvelopResponse<string>
            {
                Message = "Token gerado para recuperação de senha.",
                Data = token,
                isSuccess = true
            };
        }

    }
}
