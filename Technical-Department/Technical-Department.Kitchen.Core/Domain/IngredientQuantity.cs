using BuildingBlocks.Core.Domain;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class IngredientQuantity: Entity
    {
        public long IngredientId { get; init; }
        public Ingredient Ingredient { get; init; }
        public double Quantity { get; init; }
    }
}
