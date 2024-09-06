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
    public class KitchenWarehouseRepository : CrudDatabaseRepository<KitchenWarehouseIngredient, KitchenContext>, IKitchenWarehouseRepository
    {
        private readonly DbSet<KitchenWarehouseIngredient> _dbSet;

        public KitchenWarehouseRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<KitchenWarehouseIngredient>();
        }
        public List<KitchenWarehouseIngredient> GetAll()
        {
            return _dbSet.Include(i => i.Ingredient).ThenInclude(ing => ing.Unit).ToList();
        }
    }
}
