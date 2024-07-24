using AutoMapper;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.Core.Domain;

namespace Technical_Department.Kitchen.Core.Mappers;

public class KitchenProfile : Profile
{
    public KitchenProfile()
    {
        CreateMap<MeasurementUnitDto, MeasurementUnit>().ReverseMap();
        CreateMap<IngredientDto, Ingredient>().ReverseMap();
        CreateMap<IngredientQuantityDto, IngredientQuantity>().ReverseMap();
        CreateMap<MealDto, Meal>().ReverseMap();
        CreateMap<MealOfferDto, MealOffer>().ReverseMap();
        CreateMap<DailyMenuDto, DailyMenu>().ReverseMap();
        CreateMap<WeeklyMenuDto, WeeklyMenu>().ReverseMap();
    }
}
