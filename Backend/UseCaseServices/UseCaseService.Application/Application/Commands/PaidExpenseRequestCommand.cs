using Application.Response;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands
{
    public class PaidExpenseRequestCommand : IRequest<EnvelopResponse<string>>
    {
        public Guid RequestId { get; }

        public PaidExpenseRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
