using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.UseCases;

namespace Technical_Department.API.Controllers;

//[Authorize(Policy = "userPolicy")]
[Route("api/kitchenWarehouse")]
public class KitchenWarehouseController : BaseApiController
{
    private readonly IKitchenWarehouseService _kitchenWarehouseService;
    private readonly IIngredientRequirementService _ingredientRequirementService;

    public KitchenWarehouseController(IKitchenWarehouseService kitchenWarehouseService, IIngredientRequirementService ingredientRequirementService)
    {
        _kitchenWarehouseService = kitchenWarehouseService;
        _ingredientRequirementService = ingredientRequirementService;
    }
    [HttpPost("")]
    public ActionResult<IngredientDto> StartNewBusinessYear([FromBody] List<KitchenWarehouseIngredientDto> ingredients)
    {
        var result = _kitchenWarehouseService.StartNewBusinessYear(ingredients);
        return CreateResponse(result);
    }
    [HttpPost("deliveryNote")]
    public ActionResult UpdateKitchenWarehouse([FromBody] List<IngredientQuantityDto> deliveryNoteIngredients)
    {
        var requirementIngredients = _ingredientRequirementService.GetIngredientRequirements();
        var result = _kitchenWarehouseService.UpdateKitchenWarehouse(deliveryNoteIngredients, requirementIngredients.Value);
        return CreateResponse(result);
    }
    [HttpGet("")]
    public ActionResult<List<KitchenWarehouseIngredientDto>> GetAll()
    {
        var result = _kitchenWarehouseService.GetAll();
        return CreateResponse(result);
    }

}
