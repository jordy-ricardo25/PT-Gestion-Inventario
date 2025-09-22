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
    public async Task<ActionResult<PagedResult<Transaction>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string query = "",
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] TransactionType? type = null,
        [FromQuery] Guid? productId = null)
    {
        if (page <= 0 || pageSize <= 0) return BadRequest("page y pageSize deben ser > 0.");

        return Ok(await _service.GetAllAsync(page, pageSize, query, from, to, type, productId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetById([FromRoute] Guid id)
    {
        var tx = await _service.GetByIdAsync(id);

        return tx is null ? NotFound() : Ok(tx);
    }

    [HttpGet("by-product/{productId}")]
    public async Task<ActionResult<PagedResult<Transaction>>> GetByProduct(
        [FromRoute] Guid productId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page <= 0 || pageSize <= 0) return BadRequest("page y pageSize deben ser > 0.");

        return Ok(await _service.GetByProductAsync(productId, page, pageSize));
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> Create([FromBody] TransactionDto request)
    {
        var tx = new Transaction
        {
            Date = DateTime.UtcNow,
            Type = request.Type,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            UnitPrice = request.UnitPrice,
            Detail = request.Detail
        };

        try
        {
            var created = await _service.CreateAsync(tx);
            return Ok(created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocurrió un error inesperado al crear la transacción." });
        }
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
