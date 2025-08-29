using Microsoft.EntityFrameworkCore;
using Service.Transactions.Models;
using Service.Transactions.DTOs;
using Service.Transactions.Data;

namespace Service.Transactions.Repositories;

public sealed class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _context;

    public TransactionRepository(AppDbContext db) => _context = db;

    public async Task<PagedResult<Transaction>> GetAllAsync(int page, int pageSize)
    {
        var total = await _context.Transactions.CountAsync();

        var items = await _context.Transactions
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Transaction>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            Total = total
        };
    }

    public Task<Transaction?> GetByIdAsync(Guid id)
    {
        return _context.Transactions.FirstOrDefaultAsync(t => t.Id == id)!;
    }

    public async Task<IEnumerable<Transaction>> GetByProductAsync(
        Guid productId, DateTime? from = null, DateTime? to = null,
        TransactionType? type = null, int page = 1, int pageSize = 20)
    {
        var q = _context.Transactions.AsQueryable().Where(t => t.ProductId == productId);
        if (from.HasValue) q = q.Where(t => t.Date >= from.Value);
        if (to.HasValue) q = q.Where(t => t.Date <= to.Value);
        if (type.HasValue) q = q.Where(t => t.Type == type.Value);

        return await q
            .OrderByDescending(t => t.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Transaction> AddAsync(Transaction tx)
    {
        _context.Transactions.Add(tx);
        await _context.SaveChangesAsync();
        return tx;
    }

    //public async Task<Transaction> UpdateAsync(Transaction tx)
    //{
    //    _context.Transactions.Update(tx);
    //    await _context.SaveChangesAsync();
    //    return tx;
    //}

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Transactions.FindAsync(id);
        if (entity is null) return;

        _context.Transactions.Remove(entity);
        await _context.SaveChangesAsync();
    }
}

