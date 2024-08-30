using BuildingBlocks.Core.Domain;
using Explorer.BuildingBlocks.Core.Domain;
using System.Text.Json.Serialization;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class MealOffer : ValueObject<MealOffer>
    {
        public MealType Type { get; init; }
        public ConsumerType ConsumerType { get; init; }
        public long MealId { get; init; }
        public int ConsumerQuantity { get; init; }
        public long DailyMenuId { get; init; }
        public MealOffer() { }
        [JsonConstructor]
        public MealOffer(MealType type, ConsumerType consumerType, long mealId, int consumerQuantity, long dailyMenuId)
        {
            Type = type;
            ConsumerType = consumerType;
            MealId = mealId;
            ConsumerQuantity = consumerQuantity;
            DailyMenuId = dailyMenuId;
        }

        public MealOffer(MealOffer mealOffer, long dailyMenuId)
        {
            Type = mealOffer.Type;
            ConsumerType = mealOffer.ConsumerType;
            MealId = mealOffer.MealId;
            ConsumerQuantity = mealOffer.ConsumerQuantity;
            DailyMenuId = dailyMenuId;
        }

        protected override bool EqualsCore(MealOffer mealOffer)
        {
            return MealId == mealOffer.MealId &&
                   Type == mealOffer.Type &&
                   ConsumerType == mealOffer.ConsumerType &&
                   DailyMenuId == mealOffer.DailyMenuId;
        }

        protected override int GetHashCodeCore()
        {
            throw new NotImplementedException();
        }
    }
}
