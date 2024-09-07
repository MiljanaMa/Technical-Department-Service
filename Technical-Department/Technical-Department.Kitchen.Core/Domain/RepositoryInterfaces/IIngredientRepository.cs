using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IIngredientRepository: ICrudRepository<Ingredient>
    {
        PagedResult<Ingredient> GetPagedWithMeasurementUnit(int page, int pageSize);
        List<Ingredient> GetAll();
        bool DoesAllIngredientsExist(List<long> ingredientIds);
        void UpdateIngredientsStatus(List<long> ingredientIds);
        Ingredient Get(long ingredientId);
        Ingredient? GetSimilar(Ingredient ingredient);
    }
}
