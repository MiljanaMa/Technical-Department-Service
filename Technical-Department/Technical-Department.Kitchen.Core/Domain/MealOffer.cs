using BuildingBlocks.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class MealOffer: Entity
    {
        public MealType Type { get; init; }
        public ConsumerType ConsumerType { get; init; }
        public long MealId { get; init; }
        public Meal Meal { get; init; }
        public int EaterQuantity { get; init; }
    }
}
