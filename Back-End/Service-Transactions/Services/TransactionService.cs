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
        TransactionType? type = null)
    {
        return _repo.GetAllAsync(page, pageSize, query, from, to, type);
    }

    public Task<Transaction?> GetByIdAsync(Guid id)
    {
        return _repo.GetByIdAsync(id);
    }

    public Task<PagedResult<Transaction>> GetByProductAsync(
        Guid productId,
        int page = 1,
        int pageSize = 20)
    {
        return _repo.GetByProductAsync(productId, page, pageSize);
    }

    public async Task<Transaction> CreateAsync(Transaction tx)
    {
        if (tx.TotalPrice <= 0m) tx.TotalPrice = tx.UnitPrice * tx.Quantity;

        var product = await _products.GetByIdAsync(tx.ProductId)
            ?? throw new InvalidOperationException("Producto no encontrado en el microservicio de Products.");

        if (!product.IsActive)
            throw new InvalidOperationException("El producto no está activo.");

        AdjustStockResponse stockResp;

        if (tx.Type == TransactionType.Sale)
        {
            stockResp = await _products.DecreaseStockAsync(
                new AdjustStockRequest { ProductId = tx.ProductId, Quantity = tx.Quantity, Reason = "sale" });
        }
        else
        {
            stockResp = await _products.IncreaseStockAsync(
                new AdjustStockRequest { ProductId = tx.ProductId, Quantity = tx.Quantity, Reason = "purchase" });
        }

        if (!stockResp.Success)
            throw new InvalidOperationException(stockResp.Error ?? "No se pudo ajustar el stock.");

        return await _repo.AddAsync(tx);
    }

    //public async Task<Transaction> UpdateAsync(Guid id, Transaction tx)
    //{
    //    var existing = await _repo.GetByIdAsync(id) ?? throw new InvalidOperationException("Transacción no encontrada.");

    //    if (existing.Type == TransactionType.Sale)
    //    {
    //        var resp = await _products.IncreaseStockAsync(
    //            new AdjustStockRequest { ProductId = existing.ProductId, Quantity = existing.Quantity, Reason = "revert-sale-edit" }, ct);
    //        if (!resp.Success) throw new InvalidOperationException(resp.Error ?? "No se pudo revertir stock anterior.");
    //    }
    //    else
    //    {
    //        var resp = await _products.DecreaseStockAsync(
    //            new AdjustStockRequest { ProductId = existing.ProductId, Quantity = existing.Quantity, Reason = "revert-purchase-edit" }, ct);
    //        if (!resp.Success) throw new InvalidOperationException(resp.Error ?? "No se pudo revertir stock anterior.");
    //    }

    //    existing.Date = tx.Date;
    //    existing.Type = tx.Type;
    //    existing.ProductId = tx.ProductId;
    //    existing.Quantity = tx.Quantity;
    //    existing.UnitPrice = tx.UnitPrice;
    //    existing.TotalPrice = tx.TotalPrice > 0m ? tx.TotalPrice : tx.UnitPrice * tx.Quantity;
    //    existing.Detail = tx.Detail;

    //    AdjustStockResponse applyResp;
    //    if (existing.Type == TransactionType.Sale)
    //    {
    //        applyResp = await _products.DecreaseStockAsync(
    //            new AdjustStockRequest { ProductId = existing.ProductId, Quantity = existing.Quantity, Reason = "apply-sale-edit" }, ct);
    //    }
    //    else
    //    {
    //        applyResp = await _products.IncreaseStockAsync(
    //            new AdjustStockRequest { ProductId = existing.ProductId, Quantity = existing.Quantity, Reason = "apply-purchase-edit" }, ct);
    //    }

    //    if (!applyResp.Success)
    //        throw new InvalidOperationException(applyResp.Error ?? "No se pudo ajustar el stock para la nueva transacción.");

    //    return await _repo.UpdateAsync(existing);
    //}

    public async Task DeleteAsync(Guid id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return;

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
