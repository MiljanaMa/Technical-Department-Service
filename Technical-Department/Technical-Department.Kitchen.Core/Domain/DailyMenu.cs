using BuildingBlocks.Core.Domain;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class DailyMenu: Entity
    {
        public DayOfWeek DayOfWeek { get; init; }
        public ICollection<MealOffer> Menu { get; init; }
        public long WeeklyMenuId { get; init; }
    }
}
