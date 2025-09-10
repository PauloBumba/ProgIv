using Shared.Contracts.Contracts;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface ISignalRNotificationService
    {
        Task NotifyRoleAsync(RoleContracts role, string message);
        Task NotifyUserAsync(string userId, string message);
        Task NotifyUserAsync(string userId, object payload);

        Task NotifyAdminsAsync(string msg);
        Task NotifyFinanceTeamAsync(string msg);
        Task NotifyRequestersAsync(string msg);
    }
}
