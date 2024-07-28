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
    public class DailyMenuRepository : CrudDatabaseRepository<DailyMenu, KitchenContext>, IDailyMenuRepository
    {
        private readonly DbSet<DailyMenu> _dbSet;

        public DailyMenuRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<DailyMenu>();
        }

       public DailyMenu Get(long id)
        {
            var entity = _dbSet.AsNoTracking().FirstOrDefault(dm => dm.Id == id);
            if (entity == null) throw new KeyNotFoundException("Not found: " + id);
            return entity;
        }
    }
}
