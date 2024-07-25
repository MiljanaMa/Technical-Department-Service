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
    public class MealService : CrudService<MealDto, Meal>, IMealService
    {
        private readonly IMealRepository _mealRepository;
        public MealService(IMealRepository mealRepository, IMapper mapper) : base(mealRepository, mapper)
        {
            _mealRepository = mealRepository;
        }

        public Result<List<MealDto>> GetAll()
        {
            var result = _mealRepository.GetAll();
            return MapToDto(result);
        }

    }

}
