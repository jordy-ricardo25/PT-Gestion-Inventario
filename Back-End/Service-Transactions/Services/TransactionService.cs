using Service.Transactions.Repositories;
using Service.Transactions.External;
using Service.Transactions.Models;
using Service.Transactions.DTOs;

namespace Service.Transactions.Services;

public sealed class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _repo;
    private readonly IProductClient _products;

    public TransactionService(ITransactionRepository repo, IProductClient products)
    {
        _repo = repo;
        _products = products;
    }

    public Task<PagedResult<Transaction>> GetAllAsync(
        int page,
        int pageSize,
        string query = "",
        DateTime? from = null,
        DateTime? to = null,
        TransactionType? type = null,
        Guid? productId = null)
    {
        return _repo.GetAllAsync(page, pageSize, query, from, to, type, productId);
    }

    public Task<Transaction?> GetByIdAsync(Guid id)
    {
        return _repo.GetByIdAsync(id);
    }

    public async Task<Transaction> CreateAsync(Transaction transaction)
    {
        if (transaction.TotalPrice <= 0m) transaction.TotalPrice = transaction.UnitPrice * transaction.Quantity;

        var product = await _products.GetByIdAsync(transaction.ProductId)
            ?? throw new InvalidOperationException("Producto no encontrado en el microservicio de Products.");

        if (!product.IsActive)
            throw new InvalidOperationException("El producto no está activo.");

        AdjustStockResponse stockResp;

        if (transaction.Type == TransactionType.Sale)
        {
            stockResp = await _products.DecreaseStockAsync(
                new AdjustStockRequest { ProductId = transaction.ProductId, Quantity = transaction.Quantity, Reason = "sale" });
        }
        else
        {
            stockResp = await _products.IncreaseStockAsync(
                new AdjustStockRequest { ProductId = transaction.ProductId, Quantity = transaction.Quantity, Reason = "purchase" });
        }

        if (!stockResp.Success)
            throw new InvalidOperationException(stockResp.Error ?? "No se pudo ajustar el stock.");

        return await _repo.AddAsync(transaction);
    }

    public async Task<Transaction> UpdateAsync(Guid id, Transaction transaction)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Transacción no encontrada");

        existing.Detail = transaction.Detail;

        return await _repo.UpdateAsync(existing);
    }

    public async Task DeleteAsync(Guid id)
    {
        var existing = await _repo.GetByIdAsync(id) ?? throw new KeyNotFoundException("Transacción no encontrada"); ;

        if (existing.Type == TransactionType.Sale)
        {
            var resp = await _products.IncreaseStockAsync(
                new AdjustStockRequest { ProductId = existing.ProductId, Quantity = existing.Quantity, Reason = "delete-sale" });
            if (!resp.Success) throw new InvalidOperationException(resp.Error ?? "No se pudo revertir stock al eliminar.");
        }
        else
        {
            var resp = await _products.DecreaseStockAsync(
                new AdjustStockRequest { ProductId = existing.ProductId, Quantity = existing.Quantity, Reason = "delete-purchase" });
            if (!resp.Success) throw new InvalidOperationException(resp.Error ?? "No se pudo revertir stock al eliminar.");
        }

        await _repo.DeleteAsync(id);
    }
}
