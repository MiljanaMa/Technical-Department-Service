using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.UseCases;

namespace Technical_Department.API.Controllers
{
    [Route("api/weekly-menu")]
    public class WeeklyMenuController : BaseApiController
    {
        private readonly IWeeklyMenuService _weeklyMenuService;
        private readonly ICalorieBasedMenuService _cusomMenuService;

        public WeeklyMenuController(IWeeklyMenuService weeklyMenuService, ICalorieBasedMenuService customMenuService)
        {
            _weeklyMenuService = weeklyMenuService;
            _cusomMenuService = customMenuService;

        }

        [HttpGet("status")]
        public ActionResult<WeeklyMenuDto> GetMenuByStatus([FromQuery] string status)
        {
            var result = _weeklyMenuService.GetMenuByStatus(status);
            return CreateResponse(result);
        }

        [HttpGet("default")]
        public ActionResult<List<WeeklyMenuDto>> GetDefaultMenus()
        {
            var result = _weeklyMenuService.GetDefaultMenus();
            return CreateResponse(result);
        }

        [HttpGet("{id:int}")]
        public ActionResult<WeeklyMenuDto> Get(int id)
        {
            var result = _weeklyMenuService.GetMenuById(id);
            return CreateResponse(result);
        }

        [HttpPost("")]
        public ActionResult<WeeklyMenuDto> Create([FromQuery] string status)
        
        {
            var result = _weeklyMenuService.CreateOrFetch(status);
            return CreateResponse(result);
        }

        [HttpPost("default")]
        public ActionResult<WeeklyMenuDto> CreateDraftFromDefault([FromQuery] long defaultMenuId)
        {
            var result = _weeklyMenuService.CreateDraftFromDefault(defaultMenuId);
            return CreateResponse(result);
        }

        [HttpPut("confirm")]
        public ActionResult<WeeklyMenuDto> ConfirmWeeklyMenu([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.ConfirmWeeklyMenu(weeklyMenu);
            return CreateResponse(result);
        }

        [HttpPost("add-meal-offer")]
        public ActionResult<Boolean> AddOrReplaceMealOffer([FromBody] MealOfferDto mealOffer)
        {
            var result = _weeklyMenuService.AddOrReplaceMealOffer(mealOffer);
            return CreateResponse(result);
        }
        [HttpPut("get-requsition")]
        public ActionResult<List<IngredientQuantityDto>> GetRequsition([FromBody] WeeklyMenuDto weeklyMenuDto)
        {
            var result = _weeklyMenuService.GetRequsition(weeklyMenuDto);
            return CreateResponse(result);
        }
        [HttpGet("get-ingredients-requirements")]
        public ActionResult<List<IngredientQuantityDto>> GetIngredientRequirements([FromQuery] long dailyMenuId)
        {
            var result = _weeklyMenuService.GetIngredientRequirements(dailyMenuId);
            return CreateResponse(result);
        }

        [HttpPut("reset-draft-menu")]
        public ActionResult<WeeklyMenuDto> ResetDraftMenu([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.ResetDraftMenu(weeklyMenu);
            return CreateResponse(result);
        }

        [HttpPost("custom-menu")]
        public ActionResult<WeeklyMenuDto> CreateCalorieBasedMenu([FromQuery] int calories)

        {
            var result = _cusomMenuService.CreateCalorieBasedWeeklyMenu(calories);
            return CreateResponse(result);
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            var result = _weeklyMenuService.Delete(id);
            return CreateResponse(result);
        }
    }
}
