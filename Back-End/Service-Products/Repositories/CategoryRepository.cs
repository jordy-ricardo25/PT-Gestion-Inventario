using Microsoft.EntityFrameworkCore;
using Service.Products.Models;
using Service.Products.Data;

namespace Service.Products.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Category>> GetAllAsync(int page, int pageSize)
    {
        return await _context.Categories.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _context.Categories.FindAsync(id);
    }

    public async Task<Category> AddAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category> UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Categories.FindAsync(id);

        if (entity is null) return;

        _context.Categories.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
