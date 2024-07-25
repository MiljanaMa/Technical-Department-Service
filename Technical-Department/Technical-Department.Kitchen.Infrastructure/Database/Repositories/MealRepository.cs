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
    }
}
