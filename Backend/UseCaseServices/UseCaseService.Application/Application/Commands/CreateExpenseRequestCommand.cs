using Application.Response;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;

namespace Application.Commands
{
    public class CreateExpenseRequestCommand : IRequest<EnvelopResponse<Guid>>
    {
        public string? Id { get; set; }  // Pode até remover se for auto-gerado

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }
        public DateTime ExpenseDate { get; set; }

        // 👇 Enum agora, em vez de string ID
        

        public IFormFile? ProofFile { get; set; }
    }
}
