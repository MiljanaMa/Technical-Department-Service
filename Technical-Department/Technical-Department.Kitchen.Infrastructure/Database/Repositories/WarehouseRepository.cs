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
    public class WarehouseRepository : CrudDatabaseRepository<WarehouseIngredient, KitchenContext>, IWarehouseRepository
    {
        private readonly DbSet<WarehouseIngredient> _dbSet;

        public WarehouseRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<WarehouseIngredient>();
        }
        public List<WarehouseIngredient> GetAll()
        {
            return _dbSet.Include(i => i.Ingredient).ThenInclude(ing => ing.Unit).ToList();
        }
        public WarehouseIngredient GetByWarehouseLabel(string warehouseLabel)
        {
            return _dbSet.Include(i => i.Ingredient).FirstOrDefault(i => i.WarehouseLabel.Equals(warehouseLabel));
        }
        public List<WarehouseIngredient> AddNewWarehouseIngredients(List<WarehouseIngredient> ingredients)
        {
            var allIngredients = _dbSet.ToList();
            _dbSet.RemoveRange(allIngredients);
            _dbSet.AddRange(ingredients);
            DbContext.SaveChanges();
            return _dbSet.Include(i => i.Ingredient).ThenInclude(ing => ing.Unit).ToList();
        }
        public void UpdateIngredients(List<WarehouseIngredient> ingredients)
        {
            foreach (var ingredient in ingredients)
            {
                _dbSet.Update(ingredient);
            }

            DbContext.SaveChanges();
        }
        public WarehouseIngredient? GetByIngredientId(long ingredientId)
        {
            return _dbSet.Include(i => i.Ingredient).ThenInclude(i => i.Unit).FirstOrDefault(i => i.IngredientId ==  ingredientId);
        }
    }
}
