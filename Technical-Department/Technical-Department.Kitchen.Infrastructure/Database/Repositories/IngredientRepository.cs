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
        public bool DoesAllIngredientsExist(List<long> ingredientIds)
        {
            var existingIngredients = _dbSet
                .Where(i => ingredientIds.Contains(i.Id))
                .Select(i => i.Id)
                .ToList();
            return ingredientIds.All(id => existingIngredients.Contains(id));
        }
        public void SyncIngredientsStatuses(List<long> ingredientIds)
        {
            var allIngredients = _dbSet.ToList();

            var ingredientsToDeactivate = allIngredients
                .Where(i => !ingredientIds.Contains(i.Id))
                .ToList();

            var ingredientsToActivate = allIngredients
                .Where(i => ingredientIds.Contains(i.Id))
                .ToList();

            foreach (var ingredient in ingredientsToDeactivate)
            {
                ingredient.ChangeStatus(false);
            }

            foreach (var ingredient in ingredientsToActivate)
            {
                ingredient.ChangeStatus(true);
            }
            _dbSet.UpdateRange(ingredientsToDeactivate);
            _dbSet.UpdateRange(ingredientsToActivate);
            DbContext.SaveChanges();
        }
        public Ingredient? GetSimilar(long ingredientId)
        {
            var ingredient = _dbSet.FirstOrDefault(i => i.Id == ingredientId);
            return  _dbSet
                        .Where(i => i.Type == ingredient.Type && i.IsActive)
                        .Include(i => i.Unit)
                        .OrderBy(i =>
                            Math.Abs(i.Calories - ingredient.Calories) +
                            Math.Abs(i.Proteins - ingredient.Proteins) +
                            Math.Abs(i.Carbohydrates - ingredient.Carbohydrates) +
                            Math.Abs(i.Fats - ingredient.Fats) +
                            Math.Abs(i.Sugar - ingredient.Sugar))
                         .FirstOrDefault();
            
        }
    }
}
