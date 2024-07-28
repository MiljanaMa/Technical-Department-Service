using BuildingBlocks.Core.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;

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
        public ActionResult<List<MealDto>> GetAll()
        {
            var result = _mealService.GetAll();
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

    }
}
