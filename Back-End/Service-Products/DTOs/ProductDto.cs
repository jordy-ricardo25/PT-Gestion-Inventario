using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Service.Products.DTOs;

public sealed class ProductDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = default!;

    [MaxLength(500)]
    public string? Description { get; set; }

    public string? Image { get; set; }

    [Precision(18, 2)]
    public decimal Price { get; set; }

    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;

    public Guid CategoryId { get; set; }
}
