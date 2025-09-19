using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Services;

public interface ICategoryService
{
    Task<PagedResult<Category>> GetAllAsync(int page, int pageSize, string query);
    Task<Category?> GetByIdAsync(Guid id);
    Task<Category> CreateAsync(Category category);
    Task<Category> UpdateAsync(Guid id, Category category);
    Task DeleteAsync(Guid id);
}
