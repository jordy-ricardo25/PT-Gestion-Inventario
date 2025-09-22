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
        TransactionType? type = null,
        Guid? productId = null);

    Task<Transaction?> GetByIdAsync(Guid id);

    Task<Transaction> AddAsync(Transaction transaction);

    Task<Transaction> UpdateAsync(Transaction transaction);

    Task DeleteAsync(Guid id);
}
