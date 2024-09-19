using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.Enums;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class WeeklyMenuService : CrudService<WeeklyMenuDto, WeeklyMenu>, IWeeklyMenuService
    {
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;
        private readonly ICrudRepository<DailyMenu> _dailyMenuRepository;
        private readonly IMealRepository _mealRepository;
        private readonly IIngredientRequirementService _ingredientRequirementService;
        private readonly IMapper _mapper;
        public WeeklyMenuService(IWeeklyMenuRepository weeklyMenuRepository, IDailyMenuRepository dailyMenuRepository
            , IMealRepository mealRepository, IIngredientRepository ingredientRepository, IIngredientRequirementService ingredientRequirementService,
            IMapper mapper) : base(weeklyMenuRepository, mapper)
        {
            _weeklyMenuRepository = weeklyMenuRepository;
            _dailyMenuRepository = dailyMenuRepository;
            _mealRepository = mealRepository;
            _ingredientRequirementService = ingredientRequirementService;
            _mapper = mapper;
        }

        public Result<WeeklyMenuDto> CreateOrFetch(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                var weeklyMenu = MapToDomain(weeklyMenuDto);
                var result = CreateOrFetchWeeklyMenu(WeeklyMenuStatus.DRAFT);
                return ReturnMenuWithMealNames(result);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        public Result<WeeklyMenuDto> CreateDraftFromDefault(long defaultMenuId)
        {
            try
            {
                var defaultMenu = _weeklyMenuRepository.GetById(defaultMenuId);

                if (defaultMenu == null)
                {
                    return Result.Fail(FailureCode.InvalidArgument).WithError("Default menu not found.");
                }

                var draftMenu = CreateOrFetchWeeklyMenu(WeeklyMenuStatus.DRAFT);
                draftMenu.InitializeFromDefault(defaultMenu);

                foreach(var dailyMenu in draftMenu.Menu)
                {
                    _dailyMenuRepository.Update(dailyMenu);
                }
                return ReturnMenuWithMealNames(draftMenu);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        private WeeklyMenu CreateOrFetchWeeklyMenu(WeeklyMenuStatus status)
        {
            var existingMenu = _weeklyMenuRepository.GetByStatus(status);

            if (existingMenu != null)
            {
                return existingMenu;
            }
            var newMenu = new WeeklyMenu(status);
            newMenu = _weeklyMenuRepository.Create(newMenu);
            return newMenu;
        }

        public Result<Boolean> AddOrReplaceMealOffer(MealOfferDto mealOfferDto)
        {
            var dailyMenu = _dailyMenuRepository.Get(mealOfferDto.DailyMenuId);

            var typeDomain = (Domain.Enums.MealType)mealOfferDto.Type;
            var consumerTypeDomain = (Domain.Enums.ConsumerType)mealOfferDto.ConsumerType;

            MealOffer mealOffer = new MealOffer(typeDomain, consumerTypeDomain, mealOfferDto.MealId, mealOfferDto.ConsumerQuantity, mealOfferDto.DailyMenuId);
            dailyMenu.AddOrReplaceMealOffer(mealOffer);
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

                var result = _weeklyMenuRepository.GetByStatus(parsedStatus);
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
                WeeklyMenu weeklyMenu = MapToDomain(weeklyMenuDto);
                weeklyMenu.SetNextWeekDates();
                weeklyMenu.SetStatus(WeeklyMenuStatus.NEW);
                var result = _weeklyMenuRepository.Update(weeklyMenu);
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
        public Result<List<IngredientQuantityDto>> GetRequsition(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                var weeklyMenu = _weeklyMenuRepository.Update(MapToDomain(weeklyMenuDto));
                var ingredientRequirements = _ingredientRequirementService.GetRequsition();
                return ingredientRequirements;
            }
            catch (KeyNotFoundException e)
            {
                return Result.Fail(FailureCode.NotFound).WithError(e.Message);
            }
        }
        public Result<List<MealOfferDto>> GetIngredientRequirements(long dailyMenuId)
        {
            try
            {
                var ingredientRequirements = _ingredientRequirementService.GetIngredientRequirements(dailyMenuId);
                return ingredientRequirements;
            }
            catch (KeyNotFoundException e)
            {
                return Result.Fail(FailureCode.NotFound).WithError(e.Message);
            }
        }

        public async Task WeeklyMenuStartupCheck()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var currentWeeklyMenu = _weeklyMenuRepository.GetByStatus(WeeklyMenuStatus.CURRENT);
            if (currentWeeklyMenu != null)
            {
                if(currentWeeklyMenu.To < today)
                {
                    _weeklyMenuRepository.Delete(currentWeeklyMenu.Id);
                    var newCurrentWeeklyMenu = _weeklyMenuRepository.GetByDate(today);
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




    }

}


