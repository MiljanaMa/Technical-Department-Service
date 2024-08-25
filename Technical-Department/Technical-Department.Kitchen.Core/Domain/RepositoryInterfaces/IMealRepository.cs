using BuildingBlocks.Core.UseCases;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IMealRepository : ICrudRepository<Meal>
    {
        List<Meal> GetAll();
        Meal FindFirstMealByIngredientId(int ingredientId);
    }
}
