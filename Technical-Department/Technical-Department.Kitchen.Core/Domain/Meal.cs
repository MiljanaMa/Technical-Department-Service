

using BuildingBlocks.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class Meal: Entity
    {
        public int Code { get; init; }
        public required string Name { get; init; }
        public double Calories { get; init; }
        public DateOnly StandardizationDate { get; init; }
        public ICollection<DishType> Types { get; init; }
        public ICollection<IngredientQuantity> Ingredients { get; init; }
    }
}
