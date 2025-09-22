using Service.Products.Repositories;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Services;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _repo;

    public ProductService(IProductRepository repo)
    {
        _repo = repo;
    }

    public Task<PagedResult<Product>> GetAllAsync(
        int page,
        int pageSize,
        string query,
        Guid? categoryId = null,
        int? min = null,
        int? max = null)
    {
        return _repo.GetAllAsync(page, pageSize, query, categoryId, min, max);
    }

    public Task<Product?> GetByIdAsync(Guid id)
    {
        return _repo.GetByIdAsync(id);
    }

    public Task<Product> CreateAsync(Product producto)
    {
        return _repo.AddAsync(producto);
    }

    public async Task<Product> UpdateAsync(Guid id, Product producto)
    {
        var existing = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Producto no encontrado");

        existing.Name = producto.Name;
        existing.Description = producto.Description;
        existing.Image = producto.Image;
        existing.Price = producto.Price;
        existing.Stock = producto.Stock;
        existing.CategoryId = producto.CategoryId;

        return await _repo.UpdateAsync(existing);
    }

    public async Task DeleteAsync(Guid id)
    {
        var _ = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Producto no encontrado");

        await _repo.DeleteAsync(id);
    }
}
