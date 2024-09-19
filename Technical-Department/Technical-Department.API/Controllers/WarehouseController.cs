using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.UseCases;

namespace Technical_Department.API.Controllers;

//[Authorize(Policy = "userPolicy")]
[Route("api/kitchenWarehouse")]
public class WarehouseController : BaseApiController
{
    private readonly IWarehouseService _warehouseService;

    public WarehouseController(IWarehouseService kitchenWarehouseService)
    {
        _warehouseService = kitchenWarehouseService;
    }
    [HttpPost("")]
    public ActionResult<List<WarehouseIngredientDto>> StartNewBusinessYear([FromBody] List<WarehouseIngredientDto> ingredients)
    {
        var result = _warehouseService.StartNewBusinessYear(ingredients);
        return CreateResponse(result);
    }
    [HttpPost("deliveryNote")]
    public ActionResult UpdateKitchenWarehouse([FromBody] List<IngredientQuantityDto> deliveryNoteIngredients)
    {
        var result = _warehouseService.UpdateWarehouse(deliveryNoteIngredients);
        return CreateResponse(result);
    }
    [HttpGet("")]
    public ActionResult<List<WarehouseIngredientDto>> GetAll()
    {
        var result = _warehouseService.GetAll();
        return CreateResponse(result);
    }

}
