using Application.Dto;
using Application.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    
        public interface IRecoverPassword
        {
            Task<EnvelopResponse<string>> SendCodeByEmail(ForgotPasswordDto request);
            Task<EnvelopResponse<string>> ValidateCodeByEmail(ValidateCodeDto validate);
            Task<EnvelopResponse<string>> RecoverPassword(RecoverPassswordDto recover);
        }
    
}
