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
        private readonly IWarehouseRepository _kitchenWarehouseRepository;

        public IngredientRequirementService(IMealRepository mealRepository, IIngredientRepository ingredientRepository,
            IWeeklyMenuRepository weeklyMenuRepository, IWarehouseRepository kitchenWarehouseRepository)
        {
            _mealRepository = mealRepository;
            _ingredientRepository = ingredientRepository;
            _weeklyMenuRepository = weeklyMenuRepository;
            _kitchenWarehouseRepository = kitchenWarehouseRepository;

        }
        Result<List<MealOfferDto>> IIngredientRequirementService.GetIngredientRequirements(long dailyMenuId)
        {
            List<MealOfferDto> ingredientRequirements = new List<MealOfferDto>();
            WeeklyMenu weeklyMenu = _weeklyMenuRepository.GetByStatus(WeeklyMenuStatus.CURRENT);
            DailyMenu dailyMenu = weeklyMenu.Menu.Where(dm => dm.Id == dailyMenuId).FirstOrDefault();
            if (dailyMenu == null)
                return Result.Fail(FailureCode.NotFound).WithError("Traženi dnevni meni ne postoji.");
            try
            {
                foreach (var mealOffer in dailyMenu.Menu)
                {
                    var existingMealOffer = ingredientRequirements.FirstOrDefault(mo => (int)mo.Type == (int)mealOffer.Type && mo.MealId == mealOffer.MealId);

                    if (existingMealOffer != null)
                        ChangeQuantites(ref existingMealOffer, mealOffer);
                    else
                        ingredientRequirements.Add(MakeNewMealOffer(mealOffer));
                }
                return ingredientRequirements;
            }
            catch(Exception ex)
            {
                return Result.Fail(FailureCode.Conflict).WithError("Greska prilikom kreiranja liste namirnica");
            }
        }

        private MealOfferDto MakeNewMealOffer(MealOffer mealOffer)
        {
            var meal = _mealRepository.Get(mealOffer.MealId);
            var ingredientIds = meal.Ingredients.Select(ingredient => ingredient.IngredientId).Distinct().ToList();
            var ingredients = _ingredientRepository.GetAllByIds(ingredientIds);
            return new MealOfferDto
            {
                MealId = mealOffer.MealId,
                Type = (API.Dtos.Enums.MealType)mealOffer.Type,
                MealName = meal.Name,
                Ingredients = meal.Ingredients.Select(ingredient =>
                {
                    var ingredientDetails = ingredients.FirstOrDefault(i => i.Id == ingredient.IngredientId);
                    return new IngredientQuantityDto
                    {
                        IngredientId = (int)ingredient.IngredientId,
                        Quantity = ingredient.Quantity * mealOffer.ConsumerQuantity,
                        IngredientName = ingredientDetails?.Name,
                        UnitShortName = ingredientDetails?.Unit.ShortName,
                    };
                }).ToArray()
            };
        }

        private void ChangeQuantites(ref MealOfferDto existingMealOffer, MealOffer mealOffer)
        {
            var meal = _mealRepository.Get(mealOffer.MealId);
            foreach(var iq in existingMealOffer.Ingredients)
            {
                iq.Quantity += meal.Ingredients.FirstOrDefault(i => i.IngredientId == iq.IngredientId).Quantity * mealOffer.ConsumerQuantity;
            }
        }

        public Result<List<IngredientQuantityDto>> GetRequsition()
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