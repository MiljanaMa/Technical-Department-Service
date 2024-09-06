using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IKitchenWarehouseRepository: ICrudRepository<KitchenWarehouseIngredient>
    {
        List<KitchenWarehouseIngredient> GetAll();
    }
}
