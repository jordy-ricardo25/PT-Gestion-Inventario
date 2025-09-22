using Microsoft.AspNetCore.Mvc;
using Service.Products.Services;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<Product>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string q = "",
        [FromQuery] Guid? categoryId = null,
        [FromQuery] int? min = null,
        [FromQuery] int? max = null)
    {
        return Ok(await _service.GetAllAsync(page, pageSize, q, categoryId, min, max));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById([FromRoute] Guid id)
    {
        var px = await _service.GetByIdAsync(id);

        return px is null ? NotFound() : Ok(px);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] ProductDto request)
    {
        var px = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Image = request.Image,
            Price = request.Price,
            Stock = request.Stock,
            IsActive = request.IsActive,
            CategoryId = request.CategoryId
        };

        return Ok(await _service.CreateAsync(px));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> Update(
        [FromRoute] Guid id,
        [FromBody] ProductDto request)
    {
        var px = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Image = request.Image,
            Price = request.Price,
            Stock = request.Stock,
            IsActive = request.IsActive,
            CategoryId = request.CategoryId
        };

        try
        {
            return Ok(await _service.UpdateAsync(id, px));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocurrió un error inesperado al actualizar el producto." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocurrió un error inesperado al eliminar el producto." });
        }
    }
}
