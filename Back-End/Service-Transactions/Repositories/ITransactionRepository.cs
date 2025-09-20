using Service.Transactions.Models;
using Service.Transactions.DTOs;

namespace Service.Transactions.Repositories;

public interface ITransactionRepository
{
    Task<PagedResult<Transaction>> GetAllAsync(
        int page,
        int pageSize,
        string query = "",
        DateTime? from = null,
        DateTime? to = null,
        TransactionType? type = null);

    Task<Transaction?> GetByIdAsync(Guid id);

    Task<PagedResult<Transaction>> GetByProductAsync(
        Guid productId,
        int page = 1,
        int pageSize = 20);

    Task<Transaction> AddAsync(Transaction tx);

    //Task<Transaction> UpdateAsync(Transaction tx);

    Task DeleteAsync(Guid id);
}
