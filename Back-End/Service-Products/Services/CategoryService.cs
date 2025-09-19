using Service.Products.Repositories;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public Task<PagedResult<Category>> GetAllAsync(int page, int pageSize, string query)
    {
        return _categoryRepository.GetAllAsync(page, pageSize, query);
    }

    public Task<Category?> GetByIdAsync(Guid id)
    {
        return _categoryRepository.GetByIdAsync(id);
    }

    public Task<Category> CreateAsync(Category category)
    {
        return _categoryRepository.AddAsync(category);
    }

    public async Task<Category> UpdateAsync(Guid id, Category category)
    {
        var existing = await _categoryRepository.GetByIdAsync(id) ?? throw new Exception("Categoría no encontrada");

        existing.Name = category.Name;

        return await _categoryRepository.UpdateAsync(existing);
    }

    public Task DeleteAsync(Guid id)
    {
        return _categoryRepository.DeleteAsync(id);
    }
}
