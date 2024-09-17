using Microsoft.AspNetCore.Mvc;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;

namespace Technical_Department.API.Controllers
{
    [Route("api/weekly-menu")]
    public class WeeklyMenuController : BaseApiController
    {
        private readonly IWeeklyMenuService _weeklyMenuService;
        private readonly IIngredientRequirementService _ingredientRequirementService;
        private readonly ICustomMenuService _cusomMenuService;

        public WeeklyMenuController(IWeeklyMenuService weeklyMenuService, IIngredientRequirementService ingredientRequirementService,
            ICustomMenuService customMenuService)
        {
            _weeklyMenuService = weeklyMenuService;
            _ingredientRequirementService = ingredientRequirementService;
            _cusomMenuService = customMenuService;

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
        [HttpPut("get-ingredients-requirements")]
        public ActionResult<List<IngredientQuantityDto>> GetIngredientsRequirements([FromBody] WeeklyMenuDto weeklyMenu)
        {
            _weeklyMenuService.UpdateWeeklyMenu(weeklyMenu);
            var result = _ingredientRequirementService.GetIngredientRequirements();
            return CreateResponse(result);
        }

        [HttpPut("reset-draft-menu")]
        public ActionResult<WeeklyMenuDto> ResetDraftMenu([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.ResetDraftMenu(weeklyMenu);
            return CreateResponse(result);
        }

        [HttpPost("custom-menu")]
        public ActionResult<WeeklyMenuDto> CreateCustomMenu([FromQuery] int calories)

        {
            var result = _cusomMenuService.CreateCustomWeeklyMenu(calories);
            return CreateResponse(result);
        }
    }
}
