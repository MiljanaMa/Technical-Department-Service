using BuildingBlocks.Core.Domain;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class WeeklyMenu: Entity
    {
        public DateOnly From { get; init; }
        public DateOnly To { get; init; }
        public ICollection<DailyMenu> Menu { get; init; }
    }
}
