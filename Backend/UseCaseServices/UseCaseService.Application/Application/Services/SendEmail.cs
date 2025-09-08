using Domain.Typing;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Application.Interface;
namespace Application.Services
{
    public class SendEmail : ISendEmails
    {
        private readonly EmailConfiguration _email;

        public SendEmail(IOptions<EmailConfiguration> email)
        {
            if (email?.Value == null)
                throw new ArgumentNullException(nameof(email), "Configuração de e-mail não fornecida");

            _email = email.Value;

            if (string.IsNullOrWhiteSpace(_email.Email) ||
                string.IsNullOrWhiteSpace(_email.Password) ||
                string.IsNullOrWhiteSpace(_email.Host))
            {
                throw new ArgumentException("Configurações de e-mail inválidas no appsettings.json");
            }
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                using (var client = new SmtpClient(_email.Host, _email.Port))
                {
                    client.Credentials = new NetworkCredential(_email.Email, _email.Password);
                    client.EnableSsl = true;

                    var message = new MailMessage(_email.Email, toEmail)
                    {
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };

                    await client.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                // Aqui você poderia logar ou tratar melhor
                throw new InvalidOperationException("Falha ao enviar o e-mail: " + ex.Message, ex);
            }
        }
    }
}
