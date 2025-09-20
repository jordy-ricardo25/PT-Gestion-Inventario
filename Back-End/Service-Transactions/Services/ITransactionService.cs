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
        TransactionType? type = null);

    Task<Transaction?> GetByIdAsync(Guid id);

    Task<PagedResult<Transaction>> GetByProductAsync(
        Guid productId,
        int page = 1,
        int pageSize = 10);

    Task<Transaction> CreateAsync(Transaction tx);

    //Task<Transaction> UpdateAsync(Guid id, Transaction tx);

    Task DeleteAsync(Guid id);
}

