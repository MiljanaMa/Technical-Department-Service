using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IKitchenWarehouseService
    {
        Result<List<KitchenWarehouseIngredientDto>> StartNewBusinessYear(List<KitchenWarehouseIngredientDto> ingredients);
        Result<List<KitchenWarehouseIngredientDto>> GetAll();
        Result UpdateKitchenWarehouse(List<IngredientQuantityDto> deliveryNoteIngredients);
    }
}
