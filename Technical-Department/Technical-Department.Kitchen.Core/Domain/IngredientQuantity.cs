using BuildingBlocks.Core.Domain;
using Explorer.BuildingBlocks.Core.Domain;
using System.Text.Json.Serialization;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class IngredientQuantity : ValueObject<IngredientQuantity>
    {
        public IngredientQuantity() { }
        [JsonConstructor]
        public IngredientQuantity(long mealId, long ingredientId, double quantity)
        {
            MealId = mealId;
            IngredientId = ingredientId;
            Quantity = quantity;
        }
        public long MealId { get; init; }
        public long IngredientId { get; init; }
        public double Quantity { get; init; }
        protected override bool EqualsCore(IngredientQuantity ingredientQuantity)
        {
            return IngredientId == ingredientQuantity.IngredientId &&
                   MealId == ingredientQuantity.MealId;
        }

        protected override int GetHashCodeCore()
        {
            throw new NotImplementedException();
        }
    }
}
