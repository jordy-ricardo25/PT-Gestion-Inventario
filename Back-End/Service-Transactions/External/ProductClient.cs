using Service.Transactions.DTOs;

namespace Service.Transactions.External;

public sealed class ProductClient : IProductClient
{
    private readonly HttpClient _http;

    public ProductClient(HttpClient http, ProductClientOptions opts)
    {
        _http = http;
        _http.BaseAddress = new Uri(opts.BaseUrl.TrimEnd('/') + "/");
    }

    public async Task<ProductDto?> GetByIdAsync(Guid productId)
    {
        var resp = await _http.GetAsync($"api/Product/{productId}");
        if (!resp.IsSuccessStatusCode) return null;
        return await resp.Content.ReadFromJsonAsync<ProductDto>();
    }

    public Task<AdjustStockResponse> DecreaseStockAsync(AdjustStockRequest request)
        => ChangeStockAsync(request.ProductId, -Math.Abs(request.Quantity));

    public Task<AdjustStockResponse> IncreaseStockAsync(AdjustStockRequest request)
        => ChangeStockAsync(request.ProductId, Math.Abs(request.Quantity));

    private async Task<AdjustStockResponse> ChangeStockAsync(Guid productId, int delta)
    {
        var product = await GetByIdAsync(productId);

        if (product is null)
            return new AdjustStockResponse { Success = false, Error = "Producto no encontrado." };

        var newStock = product.Stock + delta;

        if (newStock < 0)
        {
            return new AdjustStockResponse
            {
                Success = false,
                Error = $"Stock insuficiente. Actual: {product.Stock}, requerido: {Math.Abs(delta)}."
            };
        }

        var updated = new ProductDto
        {
            Name = product.Name,
            Description = product.Description,
            Image = string.Empty,
            Price = product.Price,
            CategoryId = product.CategoryId,
            IsActive = true,
            Stock = newStock
        };

        var putResp = await _http.PutAsJsonAsync($"api/Product/{productId}", updated);
        if (!putResp.IsSuccessStatusCode)
        {
            var err = await putResp.Content.ReadAsStringAsync();
            return new AdjustStockResponse { Success = false, Error = string.IsNullOrWhiteSpace(err) ? "No se pudo actualizar el producto." : err };
        }

        return new AdjustStockResponse { Success = true, NewStock = newStock };
    }
}
