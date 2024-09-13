using AutoMapper;
using BuildingBlocks.Core.UseCases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.Core.Domain.Enums;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class CustomMenuService : BaseService<WeeklyMenuDto, WeeklyMenu>, ICustomMenuService
    {
        private readonly IMealRepository _mealRepository;
        private readonly IIngredientRepository _ingredientRepository;
        private readonly IMapper _mapper;
        public CustomMenuService(IMealRepository mealRepository, IIngredientRepository ingredientRepository, IMapper mapper) : base (mapper )
        {
            _mealRepository = mealRepository;
            _ingredientRepository = ingredientRepository;
            _mapper = mapper;
        }

        private WeeklyMenuDto ReturnMenuWithMealInformation(WeeklyMenu weeklyMenu)
        {
            if (weeklyMenu != null)
            {
                WeeklyMenuDto menuDto = MapToDto(weeklyMenu);
                foreach (var dailyMenu in menuDto.Menu)
                {
                    foreach (var mealOffer in dailyMenu.Menu)
                    {
                        mealOffer.Ingredients = new List<IngredientQuantityDto>();
                        var meal = _mealRepository.Get(mealOffer.MealId);
                        mealOffer.MealName = meal.Name;
                        mealOffer.Calories = meal.Calories;
                        
                        if (meal.Ingredients != null)
                        {
                            foreach (var item in meal.Ingredients)
                            {
                                var ingredient = _ingredientRepository.Get(item.IngredientId);
                                var ingredientQuantity = new IngredientQuantityDto();
                                ingredientQuantity.IngredientName = ingredient.Name;
                                ingredientQuantity.Quantity = item.Quantity;
                                ingredientQuantity.UnitShortName = ingredient.Unit.ShortName;
                                mealOffer.Ingredients.Add(ingredientQuantity);
                            }
                        }
                    }
                }
                return menuDto;
            }
            return MapToDto(weeklyMenu);
        }

        public Result<WeeklyMenuDto> CreateCustomWeeklyMenu(int totalCalories)
        {

            var weeklyMenu = new WeeklyMenu();
            weeklyMenu.SetNextWeekDates();

            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                var dailyMenu = GenerateCustomDailyMenu(day, totalCalories, weeklyMenu);
                weeklyMenu.Menu.Add(dailyMenu);
            }

            return ReturnMenuWithMealInformation(weeklyMenu);
        }

        private DailyMenu GenerateCustomDailyMenu(DayOfWeek dayOfWeek, int totalCalories, WeeklyMenu weeklyMenu)
        {
            var dailyMenu = new DailyMenu(dayOfWeek, weeklyMenu.Id, weeklyMenu);

            var calorieDistribution = new Dictionary<MealType, double>
                {
                    { MealType.BREAKFAST, totalCalories * 0.20 },
                    { MealType.MORNING_SNACK, totalCalories * 0.05 },
                    { MealType.LUNCH, totalCalories * 0.35 },
                    { MealType.LUNCH_SALAD, totalCalories * 0.05 },
                    { MealType.DINNER_SNACK, totalCalories * 0.05 },
                    { MealType.DINNER, totalCalories * 0.25 },
                    { MealType.DINNER_SALAD, totalCalories * 0.05 }
                };

            var selectedMeals = new List<MealOffer>();

            foreach (var (mealType, calories) in calorieDistribution)
            {
                var mealOffer = CreateMealOffer(mealType, calories, dailyMenu.Id);
                if (mealOffer != null)
                {
                    selectedMeals.Add(mealOffer);
                }
            }

            AdjustMealsToFitCalories(selectedMeals, totalCalories);

            foreach (var mealOffer in selectedMeals)
            {
                dailyMenu.AddMealOffer(mealOffer);
            }

            return dailyMenu;
        }

        private MealOffer? CreateMealOffer(MealType mealType, double requiredCalories, long dailyMenuId)
        {
            var dishType = mealType switch
            {
                MealType.BREAKFAST => DishType.BREAKFAST,
                MealType.LUNCH => DishType.LUNCH,
                MealType.DINNER => DishType.DINNER,
                MealType.LUNCH_SALAD or MealType.DINNER_SALAD => DishType.SALAD,
                _ => DishType.SNACK
            };

            var availableMeals = _mealRepository.GetAll()
                .Where(meal => meal.Types.Contains(dishType))
                .ToList();

            double dynamicTolerance = requiredCalories * 0.15;
            var mealsWithinRange = availableMeals
                .Where(meal => Math.Abs(meal.Calories - requiredCalories) <= dynamicTolerance)
                .OrderBy(meal => Math.Abs(meal.Calories - requiredCalories))
                .ToList();

            if (!mealsWithinRange.Any())
            {
                mealsWithinRange = availableMeals
                    .Where(meal => meal.Calories <= requiredCalories + dynamicTolerance)
                    .OrderBy(meal => meal.Calories)
                    .ToList();
            }

            var mealPool = mealsWithinRange.Any() ? mealsWithinRange : availableMeals;
            var random = new Random();
            var selectedMeal = mealPool.OrderBy(_ => random.Next()).FirstOrDefault();

            return selectedMeal != null
                ? new MealOffer(mealType, ConsumerType.MILD_PATIENT, selectedMeal.Id, 1, dailyMenuId)
                : null;
        }

        private void AdjustMealsToFitCalories(List<MealOffer> selectedMeals, int targetCalories)
        {
            int currentCalories = CalculateTotalCalories(selectedMeals);
            int attempts = 0;

            while (Math.Abs(currentCalories - targetCalories) > 50 && attempts < 10)
            {
                for (int i = 0; i < selectedMeals.Count; i++)
                {
                    var mealOffer = selectedMeals[i];
                    var adjustedMeal = FindCloserMeal(mealOffer, targetCalories - currentCalories);
                    if (adjustedMeal != null)
                    {
                        selectedMeals.RemoveAt(i);
                        var newMealOffer = new MealOffer(
                            mealOffer.Type,
                            mealOffer.ConsumerType,
                            adjustedMeal.Id,
                            mealOffer.ConsumerQuantity,
                            mealOffer.DailyMenuId
                        );

                        selectedMeals.Insert(i, newMealOffer);

                        currentCalories = CalculateTotalCalories(selectedMeals);
                    }

                    if (Math.Abs(currentCalories - targetCalories) <= 50)
                        break;
                }

                attempts++;
            }
        }

        private Meal? FindCloserMeal(MealOffer mealOffer, int calorieDifference)
        {
            var mealType = mealOffer.Type;
            var dishType = mealType switch
            {
                MealType.BREAKFAST => DishType.BREAKFAST,
                MealType.LUNCH => DishType.LUNCH,
                MealType.DINNER => DishType.DINNER,
                MealType.LUNCH_SALAD or MealType.DINNER_SALAD => DishType.SALAD,
                _ => DishType.SNACK
            };

            var availableMeals = _mealRepository.GetAll()
                .Where(meal => meal.Types.Contains(dishType))
                .ToList();

            var currentMeal = _mealRepository.Get(mealOffer.MealId);
            var targetCalories = currentMeal.Calories + calorieDifference;
            double tolerance = 50;

            return availableMeals
                .OrderBy(meal => Math.Abs(meal.Calories - targetCalories))
                .FirstOrDefault(meal => Math.Abs(meal.Calories - targetCalories) <= tolerance);
        }

        private int CalculateTotalCalories(List<MealOffer> mealOffers)
        {
            int totalCalories = 0;

            foreach (var mealOffer in mealOffers)
            {
                var meal = _mealRepository.Get(mealOffer.MealId);
                if (meal == null)
                {
                    continue;
                }
                totalCalories += (int)meal.Calories;
            }

            return totalCalories;
        }
    }
}
