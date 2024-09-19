using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IWarehouseRepository: ICrudRepository<WarehouseIngredient>
    {
        List<WarehouseIngredient> GetAll();
        List<WarehouseIngredient> AddNewWarehouseIngredients(List<WarehouseIngredient> ingredients);
        WarehouseIngredient GetByWarehouseLabel(string warehouseLabel);
        void UpdateIngredients(List<WarehouseIngredient> ingredients);
        WarehouseIngredient? GetByIngredientId(long ingredientId);
    }
}
