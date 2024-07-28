using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;

namespace Technical_Department.API.Controllers
{
    [Route("api/daily-menu")]
    public class DailyMenuController : BaseApiController
    {
        private readonly IDailyMenuService _dailyMenuService;

        public DailyMenuController(IDailyMenuService dailyMenuService)
        {
            _dailyMenuService = dailyMenuService;
        }
      

        [HttpGet("{id:int}")]
        public ActionResult<DailyMenuDto> Get(int id)
        {
            var result = _dailyMenuService.Get(id);
            return CreateResponse(result);
        }
        [HttpPost("")]
        public ActionResult<DailyMenuDto> Create([FromBody] DailyMenuDto dailyMenu)
        {
            var result = _dailyMenuService.Create(dailyMenu);
            return CreateResponse(result);
        }
        [HttpPut("{id:long}")]
        public ActionResult<DailyMenuDto> Update([FromBody] DailyMenuDto dailyMenu)
        {
            var result = _dailyMenuService.Update(dailyMenu);
            return CreateResponse(result);
        }

        [HttpPost("add-meal-offer")]
        public ActionResult<DailyMenuDto> AddMealOffer([FromBody] MealOfferDto mealOffer)
        {
            var result = _dailyMenuService.AddMealOffer(mealOffer);
            return CreateResponse(result);
        }

    }
}
