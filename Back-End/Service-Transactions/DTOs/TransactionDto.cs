using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Service.Transactions.Models;

namespace Service.Transactions.DTOs;

public sealed class TransactionDto
{
    public DateTime? Date { get; set; }

    [Required]
    public TransactionType Type { get; set; }

    [Required]
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Precision(18, 2)]
    public decimal UnitPrice { get; set; }

    [MaxLength(500)]
    public string? Detail { get; set; }
}
