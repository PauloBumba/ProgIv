using Application.Dto;
using Application.Response;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries
{
    public record GetExpenseRequestByIdQuery(Guid Id) : IRequest<EnvelopResponse<ExpenseRequestDto>>;
}
