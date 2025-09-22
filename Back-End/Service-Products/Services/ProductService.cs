using Service.Products.Repositories;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Services;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository repo)
    {
        _productRepository = repo;
    }

    public Task<PagedResult<Product>> GetAllAsync(
        int page,
        int pageSize,
        string query,
        Guid? categoryId = null,
        int? min = null,
        int? max = null)
    {
        return _productRepository.GetAllAsync(page, pageSize, query, categoryId, min, max);
    }

    public Task<Product?> GetByIdAsync(Guid id)
    {
        return _productRepository.GetByIdAsync(id);
    }

    public Task<Product> CreateAsync(Product producto)
    {
        return _productRepository.AddAsync(producto);
    }

    public async Task<Product> UpdateAsync(Guid id, Product producto)
    {
        var existing = await _productRepository.GetByIdAsync(id) ?? throw new Exception("Producto no encontrado");

        existing.Name = producto.Name;
        existing.Description = producto.Description;
        existing.Image = producto.Image;
        existing.Price = producto.Price;
        existing.Stock = producto.Stock;
        existing.CategoryId = producto.CategoryId;

        return await _productRepository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _productRepository.DeleteAsync(id);
    }
}
