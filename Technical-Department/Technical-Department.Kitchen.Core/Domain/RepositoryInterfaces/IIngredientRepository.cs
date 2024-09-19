using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IIngredientRepository: ICrudRepository<Ingredient>
    {
        PagedResult<Ingredient> GetPagedWithMeasurementUnit(int page, int pageSize);
        List<Ingredient> GetAll();
        List<Ingredient> GetAllByIds(List<long> ingredientIds);
        bool DoesAllIngredientsExist(List<long> ingredientIds);
        void SyncIngredientsStatuses(List<long> ingredientIds);
        Ingredient Get(long ingredientId);
        Ingredient GetWithNoTracking(long ingredientId);
        Ingredient? GetSimilar(long ingredientId);
    }
}
