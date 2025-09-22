using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Services;

public interface IProductService
{
    Task<PagedResult<Product>> GetAllAsync(
        int page,
        int pageSize,
        string query,
        Guid? categoryId = null,
        int? min = null,
        int? max = null);

    Task<PagedResult<Product>> GetByCategoryAsync(Guid id, int page, int pageSize);

    Task<Product?> GetByIdAsync(Guid id);

    Task<Product> CreateAsync(Product producto);

    Task<Product> UpdateAsync(Guid id, Product producto);

    Task DeleteAsync(Guid id);
}
