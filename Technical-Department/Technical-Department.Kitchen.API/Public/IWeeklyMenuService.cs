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
        Result<WeeklyMenuDto> Create(WeeklyMenuDto weeklyMenu);
        Result<WeeklyMenuDto> Update(WeeklyMenuDto weeklyMenu);
        Result<WeeklyMenuDto> GetDraftMenu();
    }
}
