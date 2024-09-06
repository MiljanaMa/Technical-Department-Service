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
        public KitchenWarehouseIngredient GetByWarehouseLabel(string warehouseLabel)
        {
            return _dbSet.Include(i => i.Ingredient).FirstOrDefault(i => i.WarehouseLabel.Equals(warehouseLabel));
        }
        public void AddNewWarehouseIngredients(List<KitchenWarehouseIngredient> ingredients)
        {
            var allIngredients = _dbSet.ToList();
            _dbSet.RemoveRange(allIngredients);
            _dbSet.AddRange(ingredients);
            DbContext.SaveChanges();
        }
        public void UpdateIngredients(List<KitchenWarehouseIngredient> ingredients)
        {
            foreach (var ingredient in ingredients)
            {
                _dbSet.Update(ingredient);
            }

            DbContext.SaveChanges();
        }
    }
}
