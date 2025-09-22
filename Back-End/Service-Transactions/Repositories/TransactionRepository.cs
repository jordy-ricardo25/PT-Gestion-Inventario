using Microsoft.EntityFrameworkCore;
using Service.Transactions.Models;
using Service.Transactions.DTOs;
using Service.Transactions.Data;

namespace Service.Transactions.Repositories;

public sealed class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _context;

    public TransactionRepository(AppDbContext db) => _context = db;

    public async Task<PagedResult<Transaction>> GetAllAsync(
        int page,
        int pageSize,
        string query = "",
        DateTime? from = null,
        DateTime? to = null,
        TransactionType? type = null,
        Guid? productId = null)
    {
        var q = _context.Transactions.AsQueryable().Where(
            t => (t.Detail ?? "").ToLower().Contains(
                query.ToLower()
            )
        );

        if (from.HasValue) q = q.Where(t => t.Date >= from.Value.Date);
        if (to.HasValue) q = q.Where(t => t.Date <= to.Value.Date);
        if (type.HasValue) q = q.Where(t => t.Type == type.Value);
        if (productId.HasValue) q = q.Where(t => t.ProductId == productId.Value);

        var total = await q.CountAsync();

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
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

    public async Task<Transaction> AddAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<Transaction> UpdateAsync(Transaction transaction)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _context.Transactions.FindAsync(id);

        if (entity is null) return;

        _context.Transactions.Remove(entity);
        await _context.SaveChangesAsync();
    }
}

