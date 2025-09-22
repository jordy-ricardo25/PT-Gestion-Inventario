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

    Task<Transaction> AddAsync(Transaction tx);

    //Task<Transaction> UpdateAsync(Transaction tx);

    Task DeleteAsync(Guid id);
}
