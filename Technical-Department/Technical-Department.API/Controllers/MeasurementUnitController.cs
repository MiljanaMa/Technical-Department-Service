using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;

namespace Technical_Department.API.Controllers;

//[Authorize(Policy = "userPolicy")]
[Route("api/measurementUnit")]
public class MeasurementUnitController : BaseApiController
{
    private readonly IMeasurementUnitService _measurementUnitService;

    public MeasurementUnitController(IMeasurementUnitService measurementUnitService)
    {
        _measurementUnitService = measurementUnitService;
    }

    [HttpGet("")]
    public ActionResult<IngredientDto> GetAll([FromQuery] int page, [FromQuery] int pageSize)
    {
        var result = _measurementUnitService.GetPaged(page, pageSize);
        return CreateResponse(result);
    }

}
