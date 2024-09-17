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
        Result<WeeklyMenuDto> CreateOrFetch(WeeklyMenuDto weeklyMenu);
        Result<WeeklyMenuDto> CreateDraftFromDefaultMenu(WeeklyMenuDto weeklyMenu);
        Result<WeeklyMenuDto> ConfirmWeeklyMenu(WeeklyMenuDto weeklyMenu);
        Result<WeeklyMenuDto> GetMenuByStatus(string status);
        Result<Boolean> AddMealOffer(MealOfferDto mealOfferDto);
        Task WeeklyMenuStartupCheck();
        Result<WeeklyMenuDto> ResetDraftMenu(WeeklyMenuDto weeklyMenu);
        Result<List<IngredientQuantityDto>> GetIngredientRequirements(WeeklyMenuDto weeklyMenuDto);
    }
}
