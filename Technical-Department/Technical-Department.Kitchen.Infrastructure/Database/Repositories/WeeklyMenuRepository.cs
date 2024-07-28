using BuildingBlocks.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;

namespace Technical_Department.Kitchen.Infrastructure.Database.Repositories
{
    public class WeeklyMenuRepository : CrudDatabaseRepository<WeeklyMenu, KitchenContext>, IWeeklyMenuRepository
    {
        private readonly DbSet<WeeklyMenu> _dbSet;

        public WeeklyMenuRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<WeeklyMenu>();
        }
        
    }
}
