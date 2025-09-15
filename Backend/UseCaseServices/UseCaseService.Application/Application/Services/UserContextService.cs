using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using global::Application.Interface;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
namespace Application.Services
{
    

    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUserId()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? throw new InvalidOperationException("User ID not found.");
        }
        public string GetUserEmail()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email)
                   ?? throw new InvalidOperationException("User Email not found.");
        }
    }

}
