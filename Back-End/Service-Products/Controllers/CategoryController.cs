using Microsoft.AspNetCore.Mvc;
using Service.Products.Services;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CategoryController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoryController(ICategoryService categoryService)
    {
        _service = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<Category>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string q = "")
    {
        return Ok(await _service.GetAllAsync(page, pageSize, q));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById([FromRoute] Guid id)
    {
        var category = await _service.GetByIdAsync(id);

        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Create([FromBody] CategoryDto request)
    {
        var cx = new Category
        {
            Name = request.Name
        };

        return Ok(await _service.CreateAsync(cx));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Category>> Update(
        [FromRoute] Guid id,
        [FromBody] CategoryDto request)
    {
        var cx = new Category
        {
            Name = request.Name
        };

        try
        {
            return Ok(await _service.UpdateAsync(id, cx));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocurrió un error inesperado al actualizar la categoría." });
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
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocurrió un error inesperado al eliminar la categoría." });
        }
    }
}
