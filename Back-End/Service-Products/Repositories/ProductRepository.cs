using Microsoft.EntityFrameworkCore;
using Service.Products.Models;
using Service.Products.DTOs;
using Service.Products.Data;

namespace Service.Products.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<Product>> GetAllAsync(
        int page,
        int pageSize,
        string query,
        Guid? categoryId = null,
        int? min = null,
        int? max = null)
    {
        var q = _context.Products.AsQueryable().Where(
            p => p.Name.ToLower().Contains(query.ToLower())
        );

        if (categoryId.HasValue) q = q.Where(p => p.CategoryId == categoryId.Value);
        if (min.HasValue) q = q.Where(p => p.Price >= min.Value);
        if (max.HasValue) q = q.Where(p => p.Price <= max.Value);

        var total = await q.CountAsync();

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Product>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            Total = total
        };
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<Product> AddAsync(Product producto)
    {
        _context.Products.Add(producto);
        await _context.SaveChangesAsync();
        return producto;
    }

    public async Task<Product> UpdateAsync(Product producto)
    {
        _context.Products.Update(producto);
        await _context.SaveChangesAsync();
        return producto;
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Products.FindAsync(id);

        if (entity is null) return;

        _context.Products.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
