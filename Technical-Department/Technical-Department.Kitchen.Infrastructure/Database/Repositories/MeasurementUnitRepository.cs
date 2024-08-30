using BuildingBlocks.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
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
