using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain.Enums;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Core.Domain.DomainServices
{
    public class IngredientRequirementService : IIngredientRequirementService
    {
        private readonly ICrudRepository<Meal> _mealRepository;
        private readonly IIngredientRepository _ingredientRepository;
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;
        private readonly IKitchenWarehouseRepository _kitchenWarehouseRepository;

        public IngredientRequirementService(IMealRepository mealRepository, IIngredientRepository ingredientRepository,
            IWeeklyMenuRepository weeklyMenuRepository, IKitchenWarehouseRepository kitchenWarehouseRepository)
        {
            _mealRepository = mealRepository;
            _ingredientRepository = ingredientRepository;
            _weeklyMenuRepository = weeklyMenuRepository;
            _kitchenWarehouseRepository = kitchenWarehouseRepository;

        }
        public Result<List<IngredientQuantityDto>> GetIngredientRequirements()
        {
            List<IngredientQuantityDto> ingredientRequirements = new List<IngredientQuantityDto>
            {
                new IngredientQuantityDto(55, "Hljeb bijeli", "kg", 0),
                new IngredientQuantityDto(56, "Hljeb integralni", "kg", 0)
            };

            DailyMenu? tomorrowDailyMenu = GetTomorrowDailyMenu();

            foreach (var mealOffer in tomorrowDailyMenu.Menu)
            {
                var meal = _mealRepository.Get(mealOffer.MealId);

                AddIngredientRequirements(ref ingredientRequirements, mealOffer, meal);
                IncreaseBreadQuantity(ref ingredientRequirements, mealOffer, meal);
            }
            AdjustBasedOnWarehouse(ref ingredientRequirements);
            return ingredientRequirements;
        }
        public void AdjustBasedOnWarehouse(ref List<IngredientQuantityDto> ingredientRequirements)
        {
            foreach (var ingredientQuantity in ingredientRequirements)
            {
                var warehouseIngredient = _kitchenWarehouseRepository.GetByIngredientId(ingredientQuantity.IngredientId);
                if (warehouseIngredient != null)
                {
                    double newQuantity = ingredientQuantity.Quantity - warehouseIngredient.Quantity;
                    ingredientQuantity.Quantity = Math.Max(newQuantity, 0);
                    ingredientQuantity.IngredientName = warehouseIngredient.Ingredient.Name;
                    ingredientQuantity.UnitShortName = warehouseIngredient.Ingredient.Unit.ShortName;
                }
                else
                {
                    var ingredientMatch = _ingredientRepository.GetSimilar(ingredientQuantity.IngredientId);
                    if (ingredientMatch == null)
                    {
                        SetUnknownValues(ingredientQuantity);
                    }
                    else
                    {
                        ingredientQuantity.IngredientId = (int)ingredientMatch.Id;
                        ingredientQuantity.IngredientName = ingredientMatch.Name;
                        ingredientQuantity.UnitShortName = ingredientMatch.Unit.ShortName;
                    }
                }
            }
            ingredientRequirements.RemoveAll(iq => iq.Quantity == 0);
            var mergedIngredientRequirements = ingredientRequirements
                        .GroupBy(dto => dto.IngredientId)
                        .Select(g => new IngredientQuantityDto(g.Key, g.First().IngredientName, g.First().UnitShortName, g.Sum(dto => dto.Quantity)))
                        .ToList();
            ingredientRequirements = mergedIngredientRequirements;
        }

        private void AddOrUpdateIngredientQuantities(ref List<IngredientQuantityDto> ingredientRequirements, int ingredientId, double quantityToAdd)
        {
            var existingIngredientQuantity = ingredientRequirements
                .FirstOrDefault(iq => iq.IngredientId == ingredientId);

            if (existingIngredientQuantity != null)
            {
                existingIngredientQuantity.Quantity += quantityToAdd;
            }
            else
            {
                var newIngredientQuantity = new IngredientQuantityDto(ingredientId, "", "", quantityToAdd);
                ingredientRequirements.Add(newIngredientQuantity);
            }
        }

        private void AddIngredientRequirements(ref List<IngredientQuantityDto> ingredientRequirements, MealOffer mealOffer, Meal meal)
        {
            foreach (var ingredientQuantity in meal.Ingredients)
            {
                double newQuantity = ingredientQuantity.Quantity * mealOffer.ConsumerQuantity;
                AddOrUpdateIngredientQuantities(ref ingredientRequirements, (int)ingredientQuantity.IngredientId, newQuantity);
            }
        }

        private void IncreaseBreadQuantity(ref List<IngredientQuantityDto> ingredientRequirements, MealOffer mealOffer, Meal meal)
        {
            if (meal.IsBreadIncluded)
            {
                int ingredientId = mealOffer.ConsumerType == ConsumerType.DIABETIC ? 56 : 55;
                AddOrUpdateIngredientQuantities(ref ingredientRequirements, ingredientId, 0.08);
            }
        }
        private DailyMenu? GetTomorrowDailyMenu()
        {
            int tomorrowDayOfWeek = (int)DateTime.Today.AddDays(1).DayOfWeek;
            tomorrowDayOfWeek = tomorrowDayOfWeek == 0 ? 6 : tomorrowDayOfWeek - 1;

            WeeklyMenuStatus menuStatus = tomorrowDayOfWeek == 6 ? WeeklyMenuStatus.NEW : WeeklyMenuStatus.CURRENT;
            WeeklyMenu weeklyMenu = _weeklyMenuRepository.GetByStatus(menuStatus);

            if (weeklyMenu == null)
                return null;

            return weeklyMenu.Menu.FirstOrDefault(menu => (int)menu.DayOfWeek == tomorrowDayOfWeek);
        }
        private void SetUnknownValues(IngredientQuantityDto ingredientQuantity)
        {
            ingredientQuantity.IngredientName = "Nepoznat";
            ingredientQuantity.UnitShortName = "Nepoznat";
        }
    }
}