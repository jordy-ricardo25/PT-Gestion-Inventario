namespace Service.Transactions.DTOs;

public sealed class AdjustStockRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string Reason { get; set; } = "inventory-transaction";
}
