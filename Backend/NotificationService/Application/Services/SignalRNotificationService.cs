using Infrastruture.Hubs;
using Infrastruture.Interface;
using Microsoft.AspNetCore.SignalR;
using Shared.Contracts.Contracts;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interface;
namespace Application.Services
{
    public class SignalRNotificationService : ISignalRNotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // Notifica grupo baseado no Role
        public async Task NotifyRoleAsync(RoleContracts role, string message)
        {
            await _hubContext.Clients.Group(role.ToString()).SendAsync("ReceiveNotification", message);
        }

        // Notifica usuário específico
        public async Task NotifyUserAsync(string userId, string message)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", message);
        }

        // Notificação com payload rico
        public async Task NotifyUserAsync(string userId, object payload)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", payload);
        }

        // Notificações para roles
        public Task NotifyAdminsAsync(string msg) => NotifyRoleAsync(RoleContracts.Admin, msg);
        public Task NotifyFinanceTeamAsync(string msg) => NotifyRoleAsync(RoleContracts.FinancialAnalyst, msg);
        public Task NotifyRequestersAsync(string msg) => NotifyRoleAsync(RoleContracts.Collaborator, msg);
    }
}
