using System.ComponentModel.DataAnnotations;

namespace Service.Products.DTOs;

public sealed class CategoryDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = default!;
}
