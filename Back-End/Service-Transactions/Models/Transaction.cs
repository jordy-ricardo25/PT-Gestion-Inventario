using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Service.Transactions.DTOs;

namespace Service.Transactions.Models;

public sealed class Transaction
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Required]
    public TransactionType Type { get; set; }

    [Required]
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Precision(18, 2)]
    public decimal UnitPrice { get; set; }

    [Precision(18, 2)]
    public decimal TotalPrice { get; set; }

    [MaxLength(500)]
    public string? Detail { get; set; }
}
