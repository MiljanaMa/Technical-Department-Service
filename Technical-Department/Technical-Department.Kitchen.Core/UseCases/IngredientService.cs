using AutoMapper;
using BuildingBlocks.Core.Domain;
using BuildingBlocks.Core.UseCases;
using DocumentFormat.OpenXml.InkML;
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
    private readonly IMealRepository _mealRepository;
    public IngredientService(IIngredientRepository ingredientRepository, IMeasurementUnitRepository measurementUnitRepository,
        IMealRepository mealRepository, IMapper mapper) : base(ingredientRepository, mapper)
    {
        _ingredientRepository = ingredientRepository;
        _measurementUnitRepository = measurementUnitRepository;
        _mealRepository = mealRepository;
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

            var result = _ingredientRepository.Create(newIngredient);
            return MapToDto(result);

        }
        catch(Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }
    Result<PagedResult<IngredientDto>> IIngredientService.GetPagedWithMeasurementUnit(int page, int pageSize)
    {
        var result = _ingredientRepository.GetPagedWithMeasurementUnit(page, pageSize);
        return MapToDto(result);
    }
    public Result Delete(int ingredientId)
    {
        Meal meal = _mealRepository.FindFirstMealByIngredientId(ingredientId);
        if (meal != null)
            return Result.Fail(FailureCode.Forbidden).WithError("It is not allowed to delete ingredient, it is connected to meal.");
        _ingredientRepository.Delete(ingredientId);
        return Result.Ok();
    }
}
