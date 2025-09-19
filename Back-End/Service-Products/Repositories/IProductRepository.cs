using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Repositories;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetAllAsync(int page, int pageSize, string query);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> AddAsync(Product producto);
    Task<Product> UpdateAsync(Product producto);
    Task DeleteAsync(Guid id);
}
