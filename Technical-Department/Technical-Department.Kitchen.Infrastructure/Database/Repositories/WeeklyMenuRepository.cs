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
using Npgsql;

namespace Technical_Department.Kitchen.Infrastructure.Database.Repositories
{
    public class WeeklyMenuRepository : CrudDatabaseRepository<WeeklyMenu, KitchenContext>, IWeeklyMenuRepository
    {
        private readonly DbSet<WeeklyMenu> _dbSet;

        public WeeklyMenuRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<WeeklyMenu>();
        }

        public WeeklyMenu GetMenuByStatus(WeeklyMenuStatus status)
        {
            var entity = _dbSet.Where(m => m.Status == status)
                               .Include(m => m.Menu)
                               .FirstOrDefault();
            return entity;
        }
        public WeeklyMenu GetMenuByDate(DateOnly date)
        {
            var entity = _dbSet.Where(m => m.From <= date && m.To > date)
                               .Include(m => m.Menu)
                               .FirstOrDefault();
            return entity;
        }

    }
}
