using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Repositories;

public interface ICategoryRepository
{
    Task<PagedResult<Category>> GetAllAsync(int page, int pageSize);
    Task<Category?> GetByIdAsync(Guid id);
    Task<Category> AddAsync(Category category);
    Task<Category> UpdateAsync(Category category);
    Task DeleteAsync(Guid id);
}
