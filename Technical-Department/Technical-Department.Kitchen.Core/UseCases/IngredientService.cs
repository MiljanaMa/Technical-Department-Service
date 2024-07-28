using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Core.UseCases;

public class IngredientService : CrudService<IngredientDto, Ingredient>, IIngredientService
{
    private readonly IIngredientRepository _ingredientRepository;
    private readonly IMeasurementUnitRepository _measurementUnitRepository;
    public IngredientService(IIngredientRepository ingredientRepository, IMeasurementUnitRepository measurementUnitRepository, IMapper mapper) : base(ingredientRepository, mapper)
    {
        _ingredientRepository = ingredientRepository;
        _measurementUnitRepository = measurementUnitRepository;
    }
    public Result<IngredientDto> Create(IngredientDto ingredient)
    {
        try
        {
            MeasurementUnit measurementUnit = _measurementUnitRepository.Get(ingredient.UnitId);
            if (measurementUnit == null)
                Result.Fail(FailureCode.NotFound).WithError("Merna jedinica ne postoji");

            Ingredient newIngredient = MapToDomain(ingredient);
            newIngredient.SetMeasurementUnit(measurementUnit);

            var result = CrudRepository.Create(newIngredient);
            return MapToDto(result);

        }
        catch(Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }
}
