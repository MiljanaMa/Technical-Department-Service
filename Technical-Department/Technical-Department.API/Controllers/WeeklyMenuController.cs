using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;

namespace Technical_Department.API.Controllers
{
    [Route("api/weekly-menu")]
    public class WeeklyMenuController : BaseApiController
    {
        private readonly IWeeklyMenuService _weeklyMenuService;

        public WeeklyMenuController(IWeeklyMenuService weeklyMenuService)
        {
            _weeklyMenuService = weeklyMenuService;
        }


        [HttpGet("status")]
        public ActionResult<WeeklyMenuDto> GetMenuByStatus([FromQuery] string status)
        {
            var result = _weeklyMenuService.GetMenuByStatus(status);
            return CreateResponse(result);
        }

        [HttpPost("")]
        public ActionResult<WeeklyMenuDto> Create([FromBody] WeeklyMenuDto weeklyMenu)
        
        {
            var result = _weeklyMenuService.CreateOrFetch(weeklyMenu);
            return CreateResponse(result);
        }

        [HttpPost("default")]
        public ActionResult<WeeklyMenuDto> CreateDraftFromDefaultMenu([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.CreateDraftFromDefaultMenu(weeklyMenu);
            return CreateResponse(result);
        }

        [HttpPut("confirm")]
        public ActionResult<WeeklyMenuDto> ConfirmWeeklyMenu([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.ConfirmWeeklyMenu(weeklyMenu);
            return CreateResponse(result);
        }

        [HttpPost("add-meal-offer")]
        public ActionResult<Boolean> AddMealOffer([FromBody] MealOfferDto mealOffer)
        {
            var result = _weeklyMenuService.AddMealOffer(mealOffer);
            return CreateResponse(result);
        }
        [HttpPut("get-ingredients-requirements")]
        public ActionResult<List<IngredientQuantityDto>> GetIngredientsRequirements([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.GetIngredientsRequirements(weeklyMenu);
            return CreateResponse(result);
        }

    }
}
