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
    public class DailyMenuService : CrudService<DailyMenuDto, DailyMenu>, IDailyMenuService
    {
        private readonly IDailyMenuRepository _dailyMenuRepository;
        public DailyMenuService(IDailyMenuRepository dailyMenuRepository, IMapper mapper) : base(dailyMenuRepository, mapper)
        {
            _dailyMenuRepository = dailyMenuRepository;
        }

        public Result<DailyMenuDto> AddMealOffer(MealOfferDto mealOfferDto)
        {
            var dailyMenu = _dailyMenuRepository.Get(mealOfferDto.DailyMenuId);

            var typeDomain = (Domain.Enums.MealType)mealOfferDto.Type;
            var consumerTypeDomain = (Domain.Enums.ConsumerType)mealOfferDto.ConsumerType;

            MealOffer mealOffer = new MealOffer(typeDomain, consumerTypeDomain, mealOfferDto.MealId, mealOfferDto.MealName, mealOfferDto.ConsumerQuantity, mealOfferDto.DailyMenuId);
            dailyMenu.AddMealOffer(mealOffer);
                        
            return Update(MapToDto(dailyMenu));
        }
    }
}
