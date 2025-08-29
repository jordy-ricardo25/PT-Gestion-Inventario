using Service.Transactions.Models;
using Service.Transactions.DTOs;

namespace Service.Transactions.Repositories;

public interface ITransactionRepository
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

    Task<Transaction> AddAsync(Transaction tx);

    //Task<Transaction> UpdateAsync(Transaction tx);

    Task DeleteAsync(Guid id);
}
