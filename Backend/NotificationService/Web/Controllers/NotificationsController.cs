using Application.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly ISignalRNotificationService _notificationService;

        public NotificationsController(ISignalRNotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("notify-admins")]
        public async Task<IActionResult> NotifyAdmins([FromBody] string message)
        {
            await _notificationService.NotifyAdminsAsync(message);
            return Ok("Notificação enviada para Admins");
        }
    }
}
