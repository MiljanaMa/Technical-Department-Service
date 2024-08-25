using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class MealService : CrudService<MealDto, Meal>, IMealService
    {
        private readonly IMealRepository _mealRepository;
        private readonly ICrudRepository<Ingredient> _ingredientRepository;
        private readonly IDailyMenuRepository _dailyMenuRepository;
        public MealService(IMealRepository mealRepository, IIngredientRepository ingredientRepository,
            IDailyMenuRepository dailyMenuRepository, IMapper mapper) : base(mealRepository, mapper)
        {
            _mealRepository = mealRepository;
            _ingredientRepository = ingredientRepository;
            _dailyMenuRepository = dailyMenuRepository;
        }

        public Result<ICollection<MealDto>> GetAll(int page, int pageSize)
        {
            var result = _mealRepository.GetPaged(page, pageSize);
            ICollection<MealDto> dtos = MapToDto(result).Value.Results;

            foreach (var dto in dtos)
            {
                foreach(var item in dto.Ingredients)
                {
                    var ingredient = _ingredientRepository.Get(item.IngredientId);
                    item.IngredientName = ingredient.Name;
                    item.UnitShortName = ingredient.Unit.ShortName;
                }
            }

            return Result.Ok(dtos);
        }
        public Result<MealDto> Create(MealDto meal)
        {
            double calories = 0;
            foreach(var i in meal.Ingredients)
            {
                var ingredient = _ingredientRepository.Get(i.IngredientId);

                if(ingredient.Unit.Name.Equals("Komad"))
                    calories += (ingredient.Calories * i.Quantity * 60)/100;
                else
                    calories += ingredient.Calories * i.Quantity * 10;
            }

            meal.Calories = calories;

            var result = _mealRepository.Create(MapToDomain(meal));
            return MapToDto(result);
        }
        public Result Delete(int mealId)
        {
            DailyMenu menu = _dailyMenuRepository.FindFirstMenuByMealId(mealId);
            if (menu != null)
                return Result.Fail(FailureCode.Forbidden).WithError("It is not allowed to delete meal, it is connected to menu.");
            _mealRepository.Delete(mealId);
            return Result.Ok();
        }

    }

}
