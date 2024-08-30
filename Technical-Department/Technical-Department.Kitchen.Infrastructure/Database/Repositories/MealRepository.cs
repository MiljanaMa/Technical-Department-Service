using BuildingBlocks.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;
using AutoMapper;
using DocumentFormat.OpenXml.InkML;
using Npgsql;

namespace Technical_Department.Kitchen.Infrastructure.Database.Repositories
{
    public class MealRepository : CrudDatabaseRepository<Meal, KitchenContext>, IMealRepository
    {
        private readonly DbSet<Meal> _dbSet;

        public MealRepository(KitchenContext dbContext) : base(dbContext)
        {
            _dbSet = dbContext.Set<Meal>();
        }

        public List<Meal> GetAll()
        {
            return _dbSet.ToList();
        }
        public Meal FindFirstWithIngredient(int ingredientId)
        {
            var sql = @"
                SELECT * 
                FROM kitchen.""Meals""
                WHERE EXISTS (
                    SELECT 1
                    FROM jsonb_array_elements(""Ingredients""::jsonb) AS ingredient
                    WHERE (ingredient->>'IngredientId')::bigint = @ingredientId
                )";

            var task = _dbSet
                .FromSqlRaw(sql, new NpgsqlParameter("@ingredientId", ingredientId))
                .FirstOrDefaultAsync();
            task.Wait();
            return task.Result;
        }
        public void UpdateMealCalories(Ingredient dbIngredient, double newIngredientCalories)
        {
            var sql = @"
                SELECT * 
                FROM kitchen.""Meals""
                WHERE EXISTS (
                    SELECT 1
                    FROM jsonb_array_elements(""Ingredients""::jsonb) AS ingredient
                    WHERE (ingredient->>'IngredientId')::bigint = @ingredientId
                )";

            var task = _dbSet
                .FromSqlRaw(sql, new NpgsqlParameter("@ingredientId", dbIngredient.Id)).ToListAsync();
            task.Wait();
            var meals = task.Result;

            foreach (var meal in meals)
            {
                meal.UpdateCalories(dbIngredient, newIngredientCalories);
                _dbSet.Update(meal);
            }
        }
    }
}
