using Service.Products.Repositories;
using Service.Products.Models;

namespace Service.Products.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repo;

    public CategoryService(ICategoryRepository repo) => _repo = repo;

    public Task<IEnumerable<Category>> GetAllAsync(int page, int pageSize)
    {
        return _repo.GetAllAsync(page, pageSize);
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
        var existing = await _repo.GetByIdAsync(id) ?? throw new Exception("Categoría no encontrada");

        existing.Name = category.Name;

        return await _repo.UpdateAsync(existing);
    }

    public Task DeleteAsync(Guid id)
    {
        return _repo.DeleteAsync(id);
    }
}
