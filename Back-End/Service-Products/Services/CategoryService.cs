using Service.Products.Repositories;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repo;

    public CategoryService(ICategoryRepository repo)
    {
        _repo = repo;
    }

    public Task<PagedResult<Category>> GetAllAsync(int page, int pageSize, string query)
    {
        return _repo.GetAllAsync(page, pageSize, query);
    }

    public Task<Category?> GetByIdAsync(Guid id)
    {
        return _repo.GetByIdAsync(id);
    }

    public Task<Category> CreateAsync(Category category)
    {
        return _repo.AddAsync(category);
    }

    public async Task<Category> UpdateAsync(Guid id, Category category)
    {
        var existing = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Categoría no encontrada");

        existing.Name = category.Name;

        return await _repo.UpdateAsync(existing);
    }

    public async Task DeleteAsync(Guid id)
    {
        var _ = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Categoría no encontrada");

        await _repo.DeleteAsync(id);
    }
}
