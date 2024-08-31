using BuildingBlocks.Core.Domain;
using Microsoft.VisualBasic;
using System.Collections.ObjectModel;
using Technical_Department.Kitchen.Core.Domain.Enums;
using System;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class WeeklyMenu: Entity
    {
        public DateOnly From { get; set; }
        public DateOnly To { get; set; }
        public ICollection<DailyMenu> Menu { get; init; }
        public WeeklyMenuStatus Status { get; set; }

        public WeeklyMenu()
        {
            Menu = new Collection<DailyMenu>(); ;
        }

        public void SetNextWeekDates()
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Today);
            int daysUntilNextMonday = ((int)System.DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7;

            if (daysUntilNextMonday == 0)
            {
                daysUntilNextMonday = 7;
            }

            From = today.AddDays(daysUntilNextMonday);
            To = From.AddDays(7);
        }
    }
}
