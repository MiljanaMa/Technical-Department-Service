using BuildingBlocks.Core.UseCases;
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
    public class IngredientRepository : CrudDatabaseRepository<Ingredient, KitchenContext>, IIngredientRepository
    {
        private readonly DbSet<Ingredient> _dbSet;

        public IngredientRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<Ingredient>();
        }
        public PagedResult<Ingredient> GetPagedWithMeasurementUnit(int page, int pageSize)
        {
            var task = _dbSet.Include(i => i.Unit).OrderBy(i => i.Type).GetPagedById(page, pageSize);
            task.Wait();
            return task.Result;
        }
        public List<Ingredient> GetAll()
        {
            return _dbSet.Include(i => i.Unit).ToList();
        }
        public Ingredient Get(long ingredientId)
        {
            return _dbSet.AsNoTracking().Include(i => i.Unit).FirstOrDefault(i => i.Id == ingredientId);
        }
    }
}
