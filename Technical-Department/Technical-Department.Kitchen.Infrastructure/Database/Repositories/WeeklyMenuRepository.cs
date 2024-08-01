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

        public WeeklyMenu GetMenuByStatus(WeeklyMenuStatus status)
        {
            var entity = _dbSet.Where(m => m.Status == status)
                               .Include(m => m.Menu)
                               .FirstOrDefault();
            return entity;
        }

    }
}
