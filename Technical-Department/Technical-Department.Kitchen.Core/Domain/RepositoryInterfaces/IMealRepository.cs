using BuildingBlocks.Core.UseCases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IMealRepository : ICrudRepository<Meal>
    {
        List<Meal> GetAll();
    }
}
