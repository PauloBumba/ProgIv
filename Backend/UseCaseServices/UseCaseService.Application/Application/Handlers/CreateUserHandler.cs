using Application.Commands;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Shared.Contracts.Events;
using Shared.Contracts.Contracts;
using MassTransit;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserEntities>
{
    private readonly UserManager<UserEntities> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IPublishEndpoint _publisher;

    public CreateUserHandler(UserManager<UserEntities> userManager, RoleManager<IdentityRole> roleManager, IPublishEndpoint publisher)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _publisher = publisher;
    }

    public async Task<UserEntities> Handle(CreateUserCommand register, CancellationToken cancellationToken)
    {
        var existingUser = await _userManager.FindByEmailAsync(register.Email);
        if (existingUser != null)
            return null;

        if (register.Password != register.ConfirmPassword)
            return null;

        var user = new UserEntities
        {
            Email = register.Email,
            UserName = register.Email.Split('@')[0].Trim(),
            FullName = register.FullName,
            Sex = register.Sex,
            PhoneNumber = register.PhoneNumber,
            CPF = register.CPF,
            BirthDate = register.DateOfBirth,
            AdmissionDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo")),
            
            Addresses = register.Addresses.Select(a => new AddressEntity
            {
                City = a.City,
                Country = a.Country,
                FederalState = a.Federalstate,
                ZipCode = a.ZipCode,
                District = a.District,
                NumberHouse = a.NumberHouse
            }).ToList()
        };

        var createResult = await _userManager.CreateAsync(user, register.Password);
        if (!createResult.Succeeded)
            return null;

        if (!await _roleManager.RoleExistsAsync(register.Role))
        {
            await _roleManager.CreateAsync(new IdentityRole(register.Role));
        }

        await _userManager.AddToRoleAsync(user, register.Role);

        Console.WriteLine($"Publicando CreateUserEvents: Email={user.Email}, FullName={user.FullName}");
        await _publisher.Publish(new Shared.Contracts.Events.CreateUserEvents
        {
            Email = user.Email,
            FullName = user.FullName,
            UserId=user.Id,
            CreateTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("America/Sao_Paulo"))
        }, cancellationToken);

        return user;
    }
}