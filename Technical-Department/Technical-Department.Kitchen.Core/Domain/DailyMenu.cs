using BuildingBlocks.Core.Domain;
using System.Collections.ObjectModel;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class DailyMenu: Entity
    {
        public DayOfWeek DayOfWeek { get; init; }
        public ICollection<MealOffer> Menu { get; init; }
        public long WeeklyMenuId { get; init; }
        public WeeklyMenu WeeklyMenu { get; set; }


        public DailyMenu()
        {
            Menu = new Collection<MealOffer>();
        }

        public DailyMenu(DayOfWeek dayOfWeek, long weeklyMenuId, WeeklyMenu weeklyMenu)
        {
            DayOfWeek = dayOfWeek;
            Menu = new Collection<MealOffer>();
            WeeklyMenuId = weeklyMenuId;
            WeeklyMenu = weeklyMenu;
        }

        public void AddMealOffer(MealOffer offer)
        {
                  
            var foundOffer = Menu.FirstOrDefault(o => o.Type == offer.Type && o.ConsumerType == offer.ConsumerType);
            if (foundOffer != null)
            {             
                Menu.Remove(foundOffer);
            }

            Menu.Add(offer);
        }
    }


}
