using BuildingBlocks.Core.Domain;
using Microsoft.VisualBasic;
using System.Collections.ObjectModel;
using Technical_Department.Kitchen.Core.Domain.Enums;
using System;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;

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
            SetNextWeekDates();
            Menu = new Collection<DailyMenu>();
        }

        public WeeklyMenu(WeeklyMenuStatus status)
        {
            Status = status;
            SetNextWeekDates();
            Menu = new Collection<DailyMenu>(); 
            InitializeDailyMenus();
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

        public void SetStatus(WeeklyMenuStatus status)
        {
            Status = status;
        }

        public void InitializeDailyMenus()
        {
            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                var dailyMenu = new DailyMenu(day, this.Id, this);
                Menu.Add(dailyMenu);
            }
        }


        public void InitializeFromDefault(WeeklyMenu defaultMenu)
        {
            foreach (var dailyMenu in Menu)
            {
                dailyMenu.InitializeFromDefault(defaultMenu.Menu.FirstOrDefault(dm => dm.DayOfWeek == dailyMenu.DayOfWeek));
            }
        }
    }
}
