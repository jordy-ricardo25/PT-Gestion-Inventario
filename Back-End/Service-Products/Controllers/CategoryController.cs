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

    public CategoryController(ICategoryService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll(int page = 1, int pageSize = 10)
    {
        return Ok(await _service.GetAllAsync(page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById(Guid id)
    {
        var category = await _service.GetByIdAsync(id);

        if (category is null) return NotFound();

        return Ok(category);
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
    public async Task<ActionResult<Category>> Update(Guid id, [FromBody] CategoryDto request)
    {
        var cx = new Category
        {
            Name = request.Name
        };

        return Ok(await _service.UpdateAsync(id, cx));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
