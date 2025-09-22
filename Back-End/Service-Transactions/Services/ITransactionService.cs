using Service.Transactions.Models;
using Service.Transactions.DTOs;

namespace Service.Transactions.Services;

public interface ITransactionService
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

    Task<Transaction> CreateAsync(Transaction transaction);

    Task<Transaction> UpdateAsync(Guid id, Transaction transaction);

    Task DeleteAsync(Guid id);
}

