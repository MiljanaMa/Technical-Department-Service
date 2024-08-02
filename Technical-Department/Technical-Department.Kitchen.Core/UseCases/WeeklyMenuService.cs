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

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class WeeklyMenuService : CrudService<WeeklyMenuDto, WeeklyMenu>, IWeeklyMenuService
    {
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;
        private readonly ICrudRepository<DailyMenu> _dailyMenuRepository;
        public WeeklyMenuService(IWeeklyMenuRepository weeklyMenuRepository, IDailyMenuRepository dailyMenuRepository,IMapper mapper) : base(weeklyMenuRepository, mapper)
        {
            _weeklyMenuRepository = weeklyMenuRepository;
            _dailyMenuRepository = dailyMenuRepository;
        }

        public Result<WeeklyMenuDto> CreateOrFetch(WeeklyMenuDto weeklyMenuDto)
        {
            try
            {
                var weeklyMenu = MapToDomain(weeklyMenuDto);
                var result = CreateWeeklyMenu(weeklyMenu);
                return MapToDto(result);
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
                return MapToDto(result);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        private WeeklyMenu CreateWeeklyMenu(WeeklyMenu weeklyMenu)
        {
            var existingDraftMenu = _weeklyMenuRepository.GetMenuByStatus(WeeklyMenuStatus.DRAFT);

            if (existingDraftMenu != null)
            {
                return existingDraftMenu;
            }

            var createdMenu = _weeklyMenuRepository.Create(weeklyMenu);

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

            MealOffer mealOffer = new MealOffer(typeDomain, consumerTypeDomain, mealOfferDto.MealId, mealOfferDto.MealName, mealOfferDto.ConsumerQuantity, mealOfferDto.DailyMenuId);
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
                return MapToDto(result);
            }
            catch (KeyNotFoundException e)
            {
                return Result.Fail(FailureCode.NotFound).WithError(e.Message);
            }
        }

        public Result<WeeklyMenuDto> ConfirmWeeklyMenu(WeeklyMenuDto weekluMenuDto)
        {
            try
            {
                weekluMenuDto.Status = API.Dtos.Enums.WeeklyMenuStatus.NEW;
                var result = _weeklyMenuRepository.Update(MapToDomain(weekluMenuDto));
                return MapToDto(result);
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
    }

 }


