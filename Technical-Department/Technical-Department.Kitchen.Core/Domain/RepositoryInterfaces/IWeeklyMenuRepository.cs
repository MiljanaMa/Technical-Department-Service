using BuildingBlocks.Core.UseCases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces
{
    public interface IWeeklyMenuRepository : ICrudRepository<WeeklyMenu>
    {
        WeeklyMenu GetMenuByStatus(WeeklyMenuStatus status);
    }
}
