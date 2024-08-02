using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IDailyMenuService
    {
        Result<DailyMenuDto> Create(DailyMenuDto dailyMenu);
        Result<DailyMenuDto> Update(DailyMenuDto dailyMenu);
        Result<DailyMenuDto> Get(int id);
        Result<DailyMenuDto> AddMealOffer(MealOfferDto mealOfferDto);
    }
}
