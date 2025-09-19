using Microsoft.AspNetCore.Mvc;
using Service.Products.Services;
using Service.Products.Models;
using Service.Products.DTOs;

namespace Service.Products.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IProductService _productService;

    public CategoryController(ICategoryService categoryService, IProductService productService)
    {
        _categoryService = categoryService;
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<Category>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string q = "")
    {
        return Ok(await _categoryService.GetAllAsync(page, pageSize, q));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetById([FromRoute] Guid id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        return category is null ? NotFound() : Ok(category);
    }

    [HttpGet("{id}/products")]
    public async Task<ActionResult<PagedResult<Product>>> GetProductsByCategory(
        [FromRoute] Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var products = await _productService.GetByCategoryAsync(id, page, pageSize);

        return Ok(products);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Create([FromBody] CategoryDto request)
    {
        var cx = new Category
        {
            Name = request.Name
        };

        return Ok(await _categoryService.CreateAsync(cx));
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

        return Ok(await _categoryService.UpdateAsync(id, cx));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await _categoryService.DeleteAsync(id);
        return NoContent();
    }
}
