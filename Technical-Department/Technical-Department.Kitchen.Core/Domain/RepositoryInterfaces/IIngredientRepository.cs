using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IIngredientRepository: ICrudRepository<Ingredient>
    {
        PagedResult<Ingredient> GetPagedWithMeasurementUnit(int page, int pageSize);
    }
}
