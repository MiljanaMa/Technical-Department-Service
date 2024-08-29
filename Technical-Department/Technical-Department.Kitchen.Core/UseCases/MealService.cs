using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

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
            foreach(var ingredientQuantity in meal.Ingredients)
            {
                var ingredient = _ingredientRepository.Get(ingredientQuantity.IngredientId);
                calories += addCalories(ingredientQuantity, ingredient);
            }

            meal.Calories = Math.Round(calories, 2);

            var result = _mealRepository.Create(MapToDomain(meal));
            return MapToDto(result);
        }

        private static double addCalories(IngredientQuantityDto i, Ingredient ingredient)
        {
            if (ingredient.Unit.Name.Equals("Komad"))
                return (ingredient.Calories * i.Quantity * 60) / 100;
            return ingredient.Calories * i.Quantity * 10;
        }

        public Result Delete(int mealId)
        {
            DailyMenu menu = _dailyMenuRepository.FindFirstMenuByMealId(mealId);
            if (menu != null)
                return Result.Fail(FailureCode.Forbidden).WithError("It is not allowed to delete meal, it is connected to menu.");
            _mealRepository.Delete(mealId);
            return Result.Ok();
        }
        public Result<MealDto> Update(MealDto meal)
        {
            double calories = 0;
            foreach (var ingredientQuantity in meal.Ingredients)
            {
                var ingredient = _ingredientRepository.Get(ingredientQuantity.IngredientId);
                calories += addCalories(ingredientQuantity, ingredient);
            }

            meal.Calories = Math.Round(calories, 2);

            var result = _mealRepository.Update(MapToDomain(meal));
            return MapToDto(result);
        }

    }

}
