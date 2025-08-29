namespace Service.Transactions.DTOs;

public sealed class AdjustStockResponse
{
    public bool Success { get; set; }
    public string? Error { get; set; }
    public int NewStock { get; set; }
}
