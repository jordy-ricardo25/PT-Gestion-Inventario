using Microsoft.EntityFrameworkCore;
using Service.Products.Models;
using Service.Products.DTOs;
using Service.Products.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Service.Products.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context) => _context = context;

    public async Task<PagedResult<Product>> GetAllAsync(int page, int pageSize, string query)
    {
        var total = await _context.Products.CountAsync();

        var items = await _context.Products
            .Where(p => p.Name.ToLower().Contains(query.ToLower()))
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

    public async Task<PagedResult<Product>> GetByCategoryAsync(Guid id, int page, int pageSize)
    {
        var total = await _context.Products.CountAsync();

        var items = await _context.Products
            .Where(p => p.CategoryId == id)
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
