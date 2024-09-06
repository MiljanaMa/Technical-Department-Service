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
using Technical_Department.Kitchen.Core.Domain.Enums;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Core.Domain.DomainServices
{
    public  class IngredientRequirementService : IIngredientRequirementService
    {
        private readonly ICrudRepository<Meal> _mealRepository;
        private readonly IIngredientRepository _ingredientRepository;
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;

        public IngredientRequirementService(IMealRepository mealRepository, IIngredientRepository ingredientRepository,
            IWeeklyMenuRepository weeklyMenuRepository, IMapper mapper)
        {
            _mealRepository = mealRepository;
            _ingredientRepository = ingredientRepository;
            _weeklyMenuRepository = weeklyMenuRepository;
            
        }
        public Result<List<IngredientQuantityDto>> GetIngredientRequirements()
        {
            double whiteBreadQuantity = 0;
            double blackBreadQuantity = 0;
            List<IngredientQuantity> ingredientQuantities = new List<IngredientQuantity>();

            DailyMenu? tomorrowsDailyMenu = GetTomorrowsDailyMenu();

            if (tomorrowsDailyMenu == null)
                return Result.Fail(FailureCode.NotFound).WithError("Tomorrow's menu not found");

            foreach (var mealOffer in tomorrowsDailyMenu.Menu)
            {
                var meal = _mealRepository.Get(mealOffer.MealId);

                IncreaseBreadQuantity(ref whiteBreadQuantity, ref blackBreadQuantity, mealOffer, meal);
                AddIngredientQuantities(ref ingredientQuantities, mealOffer, meal);
            }
            var mergedIngredientQuantities = ingredientQuantities.GroupBy(i => i.IngredientId)
            .Select(g => new IngredientQuantityDto((int)g.Key, _ingredientRepository.Get(g.Key).Name,
                                             _ingredientRepository.Get(g.Key).Unit.ShortName, g.Sum(x => x.Quantity))).ToList();

            mergedIngredientQuantities.Add(new IngredientQuantityDto(0, "Hljeb bijeli", "kg", whiteBreadQuantity * 2 * 0.04));
            mergedIngredientQuantities.Add(new IngredientQuantityDto(0, "Hljeb integralni", "kg", blackBreadQuantity * 2 * 0.04));
            return mergedIngredientQuantities;
        }
        private void AddIngredientQuantities(ref List<IngredientQuantity> ingredientQuantities, MealOffer mealOffer, Meal meal)
        {
            foreach (var ingredientQuantity in meal.Ingredients)
            {
                var newIngredientQuantity = new IngredientQuantity(ingredientQuantity.IngredientId, ingredientQuantity.Quantity * mealOffer.ConsumerQuantity);

                ingredientQuantities.Add(newIngredientQuantity);

            }
        }
        private void IncreaseBreadQuantity(ref double whiteBreadQuantity, ref double blackBreadQuantity, MealOffer mealOffer, Meal meal)
        {
            if (mealOffer.ConsumerType == ConsumerType.DIABETIC && meal.IsBreadIncluded)
                blackBreadQuantity += 1;
            else if (meal.IsBreadIncluded)
                whiteBreadQuantity += 1;
        }
        private DailyMenu? GetTomorrowsDailyMenu()
        {
            WeeklyMenu weeklyMenu;
            int tomorrowsDayOfWeek = (int)DateTime.Today.AddDays(1).DayOfWeek;
            tomorrowsDayOfWeek = tomorrowsDayOfWeek == 0 ? 6 : (tomorrowsDayOfWeek - 1);

            if (tomorrowsDayOfWeek == 0)
                weeklyMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.NEW);
            else
                weeklyMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.CURRENT);
            if (weeklyMenu == null)
                return null;
            var tomorrowsDailyMenu = weeklyMenu.Menu.FirstOrDefault(menu => (int)menu.DayOfWeek == tomorrowsDayOfWeek);
            return tomorrowsDailyMenu;
        }
    }
}
