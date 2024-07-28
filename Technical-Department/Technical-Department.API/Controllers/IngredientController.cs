using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;

namespace Technical_Department.API.Controllers;

//[Authorize(Policy = "userPolicy")]
[Route("api/ingredient")]
public class IngredientController : BaseApiController
{
    private readonly IIngredientService _ingredientService;

    public IngredientController(IIngredientService ingredientService)
    {
        _ingredientService = ingredientService;
    }

    [HttpGet("")]
    public ActionResult<IngredientDto> GetAll([FromQuery] int page, [FromQuery] int pageSize)
    {
        var result = _ingredientService.GetPaged(page, pageSize);
        return CreateResponse(result);
    }
    [HttpPost("")]
    public ActionResult<IngredientDto> Create([FromBody] IngredientDto ingredient)
    {
        var result = _ingredientService.Create(ingredient);
        return CreateResponse(result);
    }
    [HttpPut("{id:long}")]
    public ActionResult<IngredientDto> Update([FromBody] IngredientDto ingredient)
    {
        var result = _ingredientService.Update(ingredient);
        return CreateResponse(result);
    }

}
