using Application.Dto;
using Application.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IAuthentication
    {
       

        Task<EnvelopResponse<string>> Login(LoginDto login);
        Task<EnvelopResponse<string>> Logout();


    } 
}
