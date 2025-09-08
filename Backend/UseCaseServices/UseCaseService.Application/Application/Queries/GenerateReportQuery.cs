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
    
        public class GenerateReportQuery : IRequest<EnvelopResponse<object>>
        {
            public ExpenseReportRequestDto Dto { get; }

            public GenerateReportQuery(ExpenseReportRequestDto dto)
            {
                Dto = dto;
            }
        }
   
}
