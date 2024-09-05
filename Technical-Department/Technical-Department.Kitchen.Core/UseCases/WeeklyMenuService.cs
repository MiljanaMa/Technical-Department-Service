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
using Technical_Department.Kitchen.Core.Domain.Enums;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class WeeklyMenuService : CrudService<WeeklyMenuDto, WeeklyMenu>, IWeeklyMenuService
    {
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;
        private readonly ICrudRepository<DailyMenu> _dailyMenuRepository;
        private readonly IMealRepository _mealRepository;
        private readonly IIngredientRepository _ingredientRepository;
        private readonly IMapper _mapper;
        public WeeklyMenuService(IWeeklyMenuRepository weeklyMenuRepository, IDailyMenuRepository dailyMenuRepository
            , IMealRepository mealRepository, IIngredientRepository ingredientRepository, IMapper mapper) : base(weeklyMenuRepository, mapper)
        {
            _weeklyMenuRepository = weeklyMenuRepository;
            _dailyMenuRepository = dailyMenuRepository;
            _mealRepository = mealRepository;
            _ingredientRepository = ingredientRepository;
            _mapper = mapper;
        }

        public Result<WeeklyMenuDto> CreateOrFetch(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                var weeklyMenu = MapToDomain(weeklyMenuDto);
                var result = CreateWeeklyMenu(weeklyMenu);
                return ReturnMenuWithMealNames(result);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        public Result<WeeklyMenuDto> CreateDraftFromDefaultMenu(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                var newDraftMenu = MapToDomain(weeklyMenuDto);
                var result = CreateDraftFromDefaultMenuLogic(newDraftMenu);
                return ReturnMenuWithMealNames(result);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        private WeeklyMenu CreateWeeklyMenu(WeeklyMenu weeklyMenu)
        {
            var existingMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.DRAFT);

            if (existingMenu != null)
            {             
                return existingMenu;
            }

            var createdMenu = _weeklyMenuRepository.Create(weeklyMenu);
            createdMenu.SetNextWeekDates();

            for (int i = 0; i < 7; i++)
            {
                var dayOfWeek = (DayOfWeek)i;
                var dailyMenu = new DailyMenu(dayOfWeek, createdMenu.Id, createdMenu);           
                createdMenu.Menu.Add(dailyMenu);
            }

            _weeklyMenuRepository.Update(createdMenu);
            return createdMenu;
        }

        private WeeklyMenu CreateDraftFromDefaultMenuLogic(WeeklyMenu newDraftMenu)
        {
            var defaultMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.DEFAULT);

            if (defaultMenu == null)
            {
                return null;
            }

            var createdMenu = CreateWeeklyMenu(newDraftMenu);

            foreach (var dailyMenu in createdMenu.Menu)
            {
                dailyMenu.ClearMenu();
                var defaultDailyMenu = defaultMenu.Menu.FirstOrDefault(dm => dm.DayOfWeek == dailyMenu.DayOfWeek);
                if (defaultDailyMenu != null)
                {
                    foreach (var mealOffer in defaultDailyMenu.Menu)
                    {
                        var newOffer = new MealOffer(mealOffer, dailyMenu.Id);
                        dailyMenu.AddMealOffer(newOffer);
                        _dailyMenuRepository.Update(dailyMenu);
                    }
                }
            }

            _weeklyMenuRepository.Update(createdMenu); 
            return createdMenu;
        }

        public Result<Boolean> AddMealOffer(MealOfferDto mealOfferDto)
        {
            var dailyMenu = _dailyMenuRepository.Get(mealOfferDto.DailyMenuId);

            var typeDomain = (Domain.Enums.MealType)mealOfferDto.Type;
            var consumerTypeDomain = (Domain.Enums.ConsumerType)mealOfferDto.ConsumerType;

            MealOffer mealOffer = new MealOffer(typeDomain, consumerTypeDomain, mealOfferDto.MealId, mealOfferDto.ConsumerQuantity, mealOfferDto.DailyMenuId);
            dailyMenu.AddMealOffer(mealOffer);
            return _dailyMenuRepository.Update(dailyMenu) != null ? true : false;
        }

        public Result<WeeklyMenuDto> GetMenuByStatus(string status)
        {
            try
            {
                if (!Enum.TryParse(status, true, out WeeklyMenuStatus parsedStatus))
                {
                    return Result.Fail(FailureCode.InvalidArgument).WithError($"Invalid status value: {status}");
                }

                var result = _weeklyMenuRepository.GetMenuByStatus(parsedStatus);
                return ReturnMenuWithMealNames(result);
            }
            catch (KeyNotFoundException e)
            {
                return Result.Fail(FailureCode.NotFound).WithError(e.Message);
            }
        }

        public Result<WeeklyMenuDto> ConfirmWeeklyMenu(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                weeklyMenuDto.Status = API.Dtos.Enums.WeeklyMenuStatus.NEW;
                var result = _weeklyMenuRepository.Update(MapToDomain(weeklyMenuDto));
                return ReturnMenuWithMealNames(result);
            }
            catch (KeyNotFoundException e)
            {
                return Result.Fail(FailureCode.NotFound).WithError(e.Message);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }
        public Result<List<IngredientQuantityDto>> GetIngredientsRequirements(WeeklyMenuDto weeklyMenuDto)
        {
            double whiteBreadQuantity = 0;
            double blackBreadQuantity = 0;
            List<IngredientQuantity> ingredientQuantities = new List<IngredientQuantity>();

            var weeklyMenu = _weeklyMenuRepository.Update(MapToDomain(weeklyMenuDto));

            DailyMenu? tomorrowsDailyMenu = getTomorrowsDailyMenu(weeklyMenu);

            if (tomorrowsDailyMenu == null)
                return Result.Fail(FailureCode.NotFound).WithError("Tomorrow's menu not found");

            foreach (var mealOffer in tomorrowsDailyMenu.Menu)
            {
                var meal = _mealRepository.Get(mealOffer.MealId);

                increaseBreadQuantity(ref whiteBreadQuantity, ref blackBreadQuantity, mealOffer, meal);
                AddIngredientQuantities(ref ingredientQuantities, mealOffer, meal);
            }

            var mergedIngredientQuantities = ingredientQuantities.GroupBy(i => i.IngredientId)
                                             .Select(g => new IngredientQuantityDto((int)g.Key, _ingredientRepository.Get(g.Key).Name,
                                             _ingredientRepository.Get(g.Key).Unit.ShortName, g.Sum(x => x.Quantity))).ToList();

            mergedIngredientQuantities.Add(new IngredientQuantityDto(0, "Hljeb bijeli", "kg", whiteBreadQuantity));
            mergedIngredientQuantities.Add(new IngredientQuantityDto(0, "Hljeb integralni", "kg", blackBreadQuantity));
            return mergedIngredientQuantities;
        }

        private void AddIngredientQuantities(ref List<IngredientQuantity> ingredientQuantities, MealOffer mealOffer, Meal meal)
        {
            foreach (var ingredientQuantity in meal.Ingredients)
            {
                var newIngredientQuantity = new IngredientQuantity(ingredientQuantity.IngredientId, ingredientQuantity.Quantity * mealOffer.ConsumerQuantity);
                var newIngredientQuantityDto = _mapper.Map<IngredientQuantityDto>(newIngredientQuantity);

                ingredientQuantities.Add(newIngredientQuantity);

            }
        }

        private void increaseBreadQuantity(ref double whiteBreadQuantity, ref double blackBreadQuantity, MealOffer mealOffer, Meal meal)
        {
            if (mealOffer.ConsumerType == ConsumerType.DIABETIC && meal.IsBreadIncluded)
                blackBreadQuantity = blackBreadQuantity * 2 * 0.04;
            else if (meal.IsBreadIncluded)
                whiteBreadQuantity = whiteBreadQuantity * 2 * 0.04;
        }

        private DailyMenu? getTomorrowsDailyMenu(WeeklyMenu weeklyMenu)
        {
            int tomorrowsDayOfWeek = (int)DateTime.Today.AddDays(1).DayOfWeek;
            tomorrowsDayOfWeek = tomorrowsDayOfWeek == 0 ? 6 : (tomorrowsDayOfWeek - 1);
            var tomorrowsDailyMenu = weeklyMenu.Menu.FirstOrDefault(menu => (int)menu.DayOfWeek == tomorrowsDayOfWeek);
            return tomorrowsDailyMenu;
        }

        public async Task WeeklyMenuStartupCheck()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var currentWeeklyMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.CURRENT);
            if (currentWeeklyMenu != null)
            {
                if(currentWeeklyMenu.To < today)
                {
                    _weeklyMenuRepository.Delete(currentWeeklyMenu.Id);
                    var newCurrentWeeklyMenu = _weeklyMenuRepository.GetMenuByDate(today);
                    if(newCurrentWeeklyMenu != null)
                    {
                        newCurrentWeeklyMenu.Status = WeeklyMenuStatus.CURRENT;
                        _weeklyMenuRepository.Update(newCurrentWeeklyMenu);
                    }
                }
            }
        }

        public Result<WeeklyMenuDto> ResetDraftMenu(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                var weeklyMenu = MapToDomain(weeklyMenuDto);

                foreach (var dailyMenu in weeklyMenu.Menu)
                {
                    dailyMenu.ClearMenu();
                    _dailyMenuRepository.Update(dailyMenu);
                }
                var result = _weeklyMenuRepository.Update(weeklyMenu);
                return MapToDto(result);

            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        private WeeklyMenuDto ReturnMenuWithMealNames(WeeklyMenu weeklyMenu)
        {
            if (weeklyMenu != null)
            {
                WeeklyMenuDto menuDto = MapToDto(weeklyMenu);
                foreach (var dailyMenu in menuDto.Menu)
                {
                    foreach (var mealOffer in dailyMenu.Menu)
                    {
                        var meal = _mealRepository.Get(mealOffer.MealId);
                        mealOffer.MealName = meal.Name;
                    }
                }
                return menuDto;
            }
            return MapToDto(weeklyMenu);
        }

        public Result<WeeklyMenuDto> CreateCustomWeeklyMenu(int totalCalories)
        {
            var customMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.CUSTOM);
            if (customMenu == null)
            {
                var weeklyMenu = new WeeklyMenu();
                weeklyMenu.Status = WeeklyMenuStatus.CUSTOM;
                weeklyMenu.SetNextWeekDates();
                customMenu = _weeklyMenuRepository.Create(weeklyMenu);
            }

            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                var dailyMenu = GenerateCustomDailyMenu(day, totalCalories, customMenu);
                customMenu.Menu.Add(dailyMenu);
            }

            return ReturnMenuWithMealNames(customMenu);
        }

        private DailyMenu GenerateCustomDailyMenu(DayOfWeek dayOfWeek, double totalCalories, WeeklyMenu weeklyMenu)
        {
            var dailyMenu = new DailyMenu(dayOfWeek, weeklyMenu.Id, weeklyMenu);

            var calorieDistribution = new Dictionary<MealType, double>
            {
                { MealType.BREAKFAST, totalCalories * 0.25 },
                { MealType.MORNING_SNACK, totalCalories * 0.05 },
                { MealType.LUNCH, totalCalories * 0.4 },
                { MealType.DINNER_SNACK, totalCalories * 0.05 },
                { MealType.DINNER, totalCalories * 0.25 }
            };

            foreach (var (mealType, calories) in calorieDistribution)
            {
                var mealOffer = CreateMealOffer(mealType, calories, dailyMenu.Id);
                if (mealOffer != null)
                {
                    dailyMenu.AddMealOffer(mealOffer);
                }
            }

            return dailyMenu;
        }

        private MealOffer CreateMealOffer(MealType mealType, double requiredCalories, long dailyMenuId)
        {

            var availableMeals = _mealRepository.GetAll();

            var selectedMeal = availableMeals
                .Where(meal => meal.Types.Contains((DishType)mealType))
                .OrderBy(meal => Math.Abs(meal.Calories - requiredCalories))
                .FirstOrDefault();

            if (selectedMeal != null)
            {
                return new MealOffer(mealType, ConsumerType.MILD_PATIENT, selectedMeal.Id, 1, dailyMenuId);
            }

            return null;
        }
    }

 }


