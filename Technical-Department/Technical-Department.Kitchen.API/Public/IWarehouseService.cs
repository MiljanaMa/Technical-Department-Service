using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IWarehouseService
    {
        Result<List<WarehouseIngredientDto>> StartNewBusinessYear(List<WarehouseIngredientDto> ingredients);
        Result<List<WarehouseIngredientDto>> GetAll();
        Result UpdateWarehouse(List<IngredientQuantityDto> deliveryNoteIngredients);
    }
}
