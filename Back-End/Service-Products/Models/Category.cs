using System.ComponentModel.DataAnnotations;

namespace Service.Products.Models;

public sealed class Category
{
    public Category() { }

    [Key]
    public Guid Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = default!;

    public List<Product> Products = new();
}
