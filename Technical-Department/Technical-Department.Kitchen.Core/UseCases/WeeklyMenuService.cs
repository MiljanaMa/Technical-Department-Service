using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Core.Domain;

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class WeeklyMenuService : CrudService<WeeklyMenuDto, WeeklyMenu>, IWeeklyMenuService
    {
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;
        public WeeklyMenuService(IWeeklyMenuRepository weeklyMenuRepository, IMapper mapper) : base(weeklyMenuRepository, mapper)
        {
            _weeklyMenuRepository = weeklyMenuRepository;
        }

    }
}
