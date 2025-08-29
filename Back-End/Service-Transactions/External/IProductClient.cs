using Service.Transactions.DTOs;

namespace Service.Transactions.External;

public interface IProductClient
{
    Task<ProductDto?> GetByIdAsync(Guid productId);

    Task<AdjustStockResponse> DecreaseStockAsync(AdjustStockRequest request);

    Task<AdjustStockResponse> IncreaseStockAsync(AdjustStockRequest request);
}
