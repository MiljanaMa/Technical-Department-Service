using BuildingBlocks.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;
using BuildingBlocks.Core.Domain;
using DayOfWeek = Technical_Department.Kitchen.Core.Domain.Enums.DayOfWeek;
using Technical_Department.Kitchen.Core.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Technical_Department.Kitchen.Infrastructure.Database.Repositories
{
    public class WeeklyMenuRepository : CrudDatabaseRepository<WeeklyMenu, KitchenContext>, IWeeklyMenuRepository
    {
        private readonly DbSet<WeeklyMenu> _dbSet;

        public WeeklyMenuRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<WeeklyMenu>();
        }

        public WeeklyMenu Create(WeeklyMenu weeklyMenu)
        {
            var existingDraftMenu = _dbSet.Where(m => m.Status == WeeklyMenuStatus.DRAFT)
                                          .Include(m => m.Menu)
                                          .FirstOrDefault();

            if (existingDraftMenu != null)
            {
                return existingDraftMenu;
            }

            _dbSet.Add(weeklyMenu); 
            DbContext.SaveChanges();

            for (int i = 0; i < 7; i++)
            {
                DayOfWeek dayOfWeek = (DayOfWeek)i;
                DailyMenu dailyMenu = new DailyMenu(dayOfWeek, weeklyMenu.Id, weeklyMenu);
                weeklyMenu.Menu.Add(dailyMenu);
            }

            DbContext.SaveChanges();
            return weeklyMenu;
        }

        public WeeklyMenu CreateDraftFromDefaultMenu(WeeklyMenu newDraftMenu)
        {
            var existingDraftMenu = GetMenuByStatus(WeeklyMenuStatus.DRAFT);

            var defaultMenu = GetMenuByStatus(WeeklyMenuStatus.DEFAULT);

            if (defaultMenu == null)
            {
                return null;
            }

            if (existingDraftMenu != null)
            {
                foreach (var dailyMenu in existingDraftMenu.Menu)
                {
                    dailyMenu.ClearMenu();
                    var defaultDailyMenu = defaultMenu.Menu.FirstOrDefault(dm => dm.DayOfWeek == dailyMenu.DayOfWeek);
                    if (defaultDailyMenu != null)
                    {
                        foreach (var mealOffer in defaultDailyMenu.Menu)
                        {
                            MealOffer newOffer = new MealOffer(mealOffer, dailyMenu.Id);
                            dailyMenu.Menu.Add(newOffer);
                            DbContext.Update(dailyMenu);
                            DbContext.SaveChanges();
                        }
                    }
                }

                return existingDraftMenu;
            }

            WeeklyMenu createdMenu = Create(newDraftMenu);

            foreach (var dailyMenu in createdMenu.Menu)
            {
                dailyMenu.ClearMenu();
                var defaultDailyMenu = defaultMenu.Menu.FirstOrDefault(dm => dm.DayOfWeek == dailyMenu.DayOfWeek);
                if (defaultDailyMenu != null)
                {
                    foreach (var mealOffer in defaultDailyMenu.Menu)
                    {
                        MealOffer newOffer = new MealOffer(mealOffer, dailyMenu.Id);
                        dailyMenu.AddMealOffer(newOffer);
                        DbContext.Update(dailyMenu);
                        DbContext.SaveChanges();
                    }
                }
            }
            return createdMenu;
        }


        public WeeklyMenu GetMenuByStatus(WeeklyMenuStatus status)
        {
            var entity = _dbSet.Where(m => m.Status == status)
                               .Include(m => m.Menu)
                               .FirstOrDefault();
            return entity;
        }

    }
}
