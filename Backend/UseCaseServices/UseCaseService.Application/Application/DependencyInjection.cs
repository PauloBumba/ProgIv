using Application.Interface;
using Application.Security;
using Application.Services;
using Application.Services.Application.Services;
using Domain.Typing;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Application
{
    public static class DependencyInjection
    {
        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthentication, AuthenticationServices>();
            services.AddScoped<IJwyServices, JwtSecurity>();
            services.AddScoped<IAdminServices, AdminServices>();
            services.AddScoped<IRecoverPassword, RecoverPasswordServices>();
            services.AddScoped<IUserServices, UserService>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserContextService, UserContextService>();
            services.AddScoped<ISendEmails, SendEmail>();
          

            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddMassTransit(x =>
            {
                x.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host("48.223.216.70", 5672, "/", h =>
                    {
                        h.Username("guest");
                        h.Password("guest");
                    });

                });

                // REGISTRA O CONTRATO DO EVENTO
                x.SetKebabCaseEndpointNameFormatter();
            });

        }
    }
}
