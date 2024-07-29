using BuildingBlocks.Core.UseCases;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IMealService
    {
        Result<ICollection<MealDto>> GetAll(int page, int pageSize);
        Result<MealDto> Create(MealDto meal);
        Result<MealDto> Update(MealDto meal);
        Result<MealDto> Get(int id);
    }
}
