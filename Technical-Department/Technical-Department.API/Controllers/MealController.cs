using BuildingBlocks.Core.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.UseCases;

namespace Technical_Department.API.Controllers
{
    [Route("api/meal")]
    public class MealController : BaseApiController
    {
        private readonly IMealService _mealService;

        public MealController(IMealService mealService)
        {
            _mealService = mealService;
        }

        [HttpGet]
        public ActionResult<List<MealDto>> GetAll([FromQuery] int page, [FromQuery] int pageSize)
        {
            var result = _mealService.GetAll(page, pageSize);
            return CreateResponse(result);
        }

        [HttpGet("{id:int}")]
        public ActionResult<MealDto> Get(int id)
        {
            var result = _mealService.Get(id);
            return CreateResponse(result);
        }
        [HttpPost("")]
        public ActionResult<MealDto> Create([FromBody] MealDto meal)
        {
            var result = _mealService.Create(meal);
            return CreateResponse(result);
        }
        [HttpPut("{id:long}")]
        public ActionResult<MealDto> Update([FromBody] MealDto meal)
        {
            var result = _mealService.Update(meal);
            return CreateResponse(result);
        }
        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            var result = _mealService.Delete(id);
            return CreateResponse(result);
        }

    }
}
