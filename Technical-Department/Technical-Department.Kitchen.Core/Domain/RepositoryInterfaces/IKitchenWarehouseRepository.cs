using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IKitchenWarehouseRepository: ICrudRepository<KitchenWarehouseIngredient>
    {
        List<KitchenWarehouseIngredient> GetAll();
        void AddNewWarehouseIngredients(List<KitchenWarehouseIngredient> ingredients);
        KitchenWarehouseIngredient GetByWarehouseLabel(string warehouseLabel);
        void UpdateIngredients(List<KitchenWarehouseIngredient> ingredients);
    }
}
