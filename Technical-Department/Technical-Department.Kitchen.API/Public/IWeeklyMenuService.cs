using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IWeeklyMenuService
    {
        Result<WeeklyMenuDto> CreateOrFetch(string status);
        Result<WeeklyMenuDto> CreateDraftFromDefault(long defaultMenuId);
        Result<WeeklyMenuDto> ConfirmWeeklyMenu(WeeklyMenuDto weeklyMenu);
        Result<List<WeeklyMenuDto>> GetDefaultMenus();
        Result<WeeklyMenuDto> GetMenuByStatus(string status);
        Result<WeeklyMenuDto> GetMenuById(long id);
        Result<Boolean> AddOrReplaceMealOffer(MealOfferDto mealOfferDto);
        Task WeeklyMenuStartupCheck();
        Result<WeeklyMenuDto> ResetDraftMenu(WeeklyMenuDto weeklyMenu);
        Result Delete(int id);
        Result<List<IngredientQuantityDto>> GetRequsition(WeeklyMenuDto weeklyMenuDto);
        Result<List<MealOfferDto>> GetIngredientRequirements(long dailyMenuId);

    }
}
