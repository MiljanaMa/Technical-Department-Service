using BuildingBlocks.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Infrastructure.Database.Repositories
{
    public class MeasurementUnitRepository : CrudDatabaseRepository<MeasurementUnit, KitchenContext>, IMeasurementUnitRepository
    {
        private readonly DbSet<MeasurementUnit> _dbSet;

        public MeasurementUnitRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<MeasurementUnit>();
        }
    }
}
