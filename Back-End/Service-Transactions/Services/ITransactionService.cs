using Service.Transactions.Models;
using Service.Transactions.DTOs;

namespace Service.Transactions.Services;

public interface ITransactionService
{
    Task<PagedResult<Transaction>> GetAllAsync(int page, int pageSize);

    Task<Transaction?> GetByIdAsync(Guid id);

    Task<IEnumerable<Transaction>> GetByProductAsync(
        Guid productId,
        DateTime? from = null,
        DateTime? to = null,
        TransactionType? type = null,
        int page = 1,
        int pageSize = 20);

    Task<Transaction> CreateAsync(Transaction tx);

    //Task<Transaction> UpdateAsync(Guid id, Transaction tx);

    Task DeleteAsync(Guid id);
}

