using System;
using Service.Products.Models;

namespace Service.Products.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync(int page, int pageSize);
    Task<Category?> GetByIdAsync(Guid id);
    Task<Category> AddAsync(Category category);
    Task<Category> UpdateAsync(Category category);
    Task DeleteAsync(Guid id);
}
