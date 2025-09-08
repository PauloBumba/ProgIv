using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Domain.Settings;
using Infrastruture.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
        
            _configuration = configuration;
        }
  

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var _settings = _configuration.GetSection("EmailSettings").Get<EmailSettings>();
            if (_settings == null)
            {
                throw new InvalidOperationException("Email settings are not configured.");
            }
            if (string.IsNullOrEmpty(_settings.Email) || string.IsNullOrEmpty(_settings.Password) ||
                string.IsNullOrEmpty(_settings.Host) || _settings.Port <= 0)
            {
                throw new InvalidOperationException("Email settings are incomplete.");
            }
            Console.WriteLine("DEBUG: EmailSettings:");
            var rawSettings = _configuration.GetSection("EmailSettings").GetChildren();
            foreach (var item in rawSettings)
            {
                Console.WriteLine($"{item.Key} = {item.Value}");
            }


            Console.WriteLine("Email config json: " + _configuration.GetSection("EmailSettings").Exists());
            using var client = new SmtpClient(_settings.Host, _settings.Port)
            {
                Credentials = new NetworkCredential(_settings.Email, _settings.Password),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(_settings.Email),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(to);

            await client.SendMailAsync(message);
        }
    }
}
