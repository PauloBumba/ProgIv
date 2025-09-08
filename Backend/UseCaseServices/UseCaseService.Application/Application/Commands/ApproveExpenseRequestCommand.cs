using Application.Response;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands
{
    public class ApproveExpenseRequestCommand : IRequest<EnvelopResponse<string>>
    {
        public Guid RequestId { get; }

        public ApproveExpenseRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
