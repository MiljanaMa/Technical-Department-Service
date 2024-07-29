using BuildingBlocks.Core.Domain;
using Explorer.BuildingBlocks.Core.Domain;
using System.Text.Json.Serialization;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class IngredientQuantity : ValueObject<IngredientQuantity>
    {
        public IngredientQuantity() { }
        [JsonConstructor]
        public IngredientQuantity(long ingredientId, double quantity)
        {
            IngredientId = ingredientId;
            Quantity = quantity;
        }
        public long IngredientId { get; init; }
        public double Quantity { get; init; }
        protected override bool EqualsCore(IngredientQuantity ingredientQuantity)
        {
            return IngredientId == ingredientQuantity.IngredientId;
        }

        protected override int GetHashCodeCore()
        {
            throw new NotImplementedException();
        }
    }
}
