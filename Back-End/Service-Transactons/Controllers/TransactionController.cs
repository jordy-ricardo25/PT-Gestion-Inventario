using Microsoft.AspNetCore.Mvc;
using Service.Transactions.Models;
using Service.Transactions.DTOs;
using Service.Transactions.Services;

namespace Service.Transactions.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TransactionController : ControllerBase
{
    private readonly ITransactionService _service;

    public TransactionController(ITransactionService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        return Ok(await _service.GetAllAsync(page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetById([FromRoute] Guid id)
    {
        var tx = await _service.GetByIdAsync(id);

        return tx is null ? NotFound() : Ok(tx);
    }

    [HttpGet("by-product/{productId}")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetByProduct(
        [FromRoute] Guid productId,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] TransactionType? type,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (page <= 0 || pageSize <= 0) return BadRequest("page y pageSize deben ser > 0.");
        var items = await _service.GetByProductAsync(productId, from, to, type, page, pageSize);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> Create([FromBody] TransactionDto request)
    {
        var tx = new Transaction
        {
            Date = request.Date ?? DateTime.UtcNow,
            Type = request.Type,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            UnitPrice = request.UnitPrice,
            Detail = request.Detail
        };

        return Ok(await _service.CreateAsync(tx));
    }

    //[HttpPut("{id}")]
    //public async Task<ActionResult<Transaction>> Update([FromRoute] Guid id, [FromBody] TransactionDto request)
    //{
    //    var tx = new Transaction
    //    {
    //        Date = request.Date ?? DateTime.UtcNow,
    //        Type = request.Type,
    //        ProductId = request.ProductId,
    //        Quantity = request.Quantity,
    //        UnitPrice = request.UnitPrice,
    //        TotalPrice = request.TotalPrice ?? 0m,
    //        Detail = request.Detail
    //    };

    //    return Ok(await _service.UpdateAsync(id, tx));
    //}

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
