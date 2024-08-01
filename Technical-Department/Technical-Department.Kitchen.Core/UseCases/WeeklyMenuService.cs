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
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.UseCases
{
    public class WeeklyMenuService : CrudService<WeeklyMenuDto, WeeklyMenu>, IWeeklyMenuService
    {
        private readonly IWeeklyMenuRepository _weeklyMenuRepository;
        public WeeklyMenuService(IWeeklyMenuRepository weeklyMenuRepository, IMapper mapper) : base(weeklyMenuRepository, mapper)
        {
            _weeklyMenuRepository = weeklyMenuRepository;
        }

        public override Result<WeeklyMenuDto> Create(WeeklyMenuDto weeklyMenu)
        {
            try
            {
                var result = _weeklyMenuRepository.Create(MapToDomain(weeklyMenu));
                return MapToDto(result);
            }   
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        public Result<WeeklyMenuDto> CreateDraftFromDefaultMenu(WeeklyMenuDto weeklyMenu)
        {
            try
            {
                var result = _weeklyMenuRepository.CreateDraftFromDefaultMenu(MapToDomain(weeklyMenu));
                return MapToDto(result);
            }
            catch (ArgumentException e)
            {
                return Result.Fail(FailureCode.InvalidArgument).WithError(e.Message);
            }
        }

        public Result<WeeklyMenuDto> GetMenuByStatus(string status)
        {
            try
            {
                if (!Enum.TryParse(status, true, out WeeklyMenuStatus parsedStatus))
                {
                    return Result.Fail(FailureCode.InvalidArgument).WithError($"Invalid status value: {status}");
                }

                var result = _weeklyMenuRepository.GetMenuByStatus(parsedStatus);
                return MapToDto(result);
            }
            catch (KeyNotFoundException e)
            {
                return Result.Fail(FailureCode.NotFound).WithError(e.Message);
            }
        }

    }
}
