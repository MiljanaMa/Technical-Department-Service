using BuildingBlocks.Core.Domain;
using Microsoft.VisualBasic;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class WeeklyMenu: Entity
    {
        public DateOnly From { get; init; }
        public DateOnly To { get; init; }
        public ICollection<DailyMenu> Menu { get; init; }
        public WeeklyMenuStatus Status { get; init; }

    }
}
