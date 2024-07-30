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


        [HttpGet("draft")]
        public ActionResult<WeeklyMenuDto> GetDraftWeeklyMenu()
        {
            var result = _weeklyMenuService.GetDraftMenu();
            return CreateResponse(result);
        }

        [HttpPost("")]
        public ActionResult<WeeklyMenuDto> Create([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.Create(weeklyMenu);
            return CreateResponse(result);
        }
         
        [HttpPut("{id:long}")]
        public ActionResult<WeeklyMenuDto> Update([FromBody] WeeklyMenuDto weeklyMenu)
        {
            var result = _weeklyMenuService.Update(weeklyMenu);
            return CreateResponse(result);
        }

    }
}
