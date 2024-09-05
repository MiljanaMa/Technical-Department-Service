using AutoMapper;
using BuildingBlocks.Core.Domain;
using BuildingBlocks.Core.UseCases;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
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
    public Result<IngredientDto> Update(IngredientDto ingredient)
    {
        try
        {
            MeasurementUnit measurementUnit = _measurementUnitRepository.Get(ingredient.UnitId);
            if (measurementUnit == null)
                Result.Fail(FailureCode.NotFound).WithError("Merna jedinica ne postoji");

            Ingredient updatedIngredient = MapToDomain(ingredient);
            updatedIngredient.SetMeasurementUnit(measurementUnit);

            var dbIngredient = _ingredientRepository.Get(ingredient.Id);
            if (dbIngredient.Calories != updatedIngredient?.Calories)
            {
                var newCalories = measurementUnit.Name.Equals("Komad") ? (updatedIngredient.Calories * 0.6) : updatedIngredient.Calories * 10;
                _mealRepository.UpdateMealCalories(dbIngredient, newCalories);
            }
                _mealRepository.UpdateMealCalories(dbIngredient, updatedIngredient.Calories);
            var result = _ingredientRepository.Update(updatedIngredient);
            return MapToDto(result);

        }
        catch (Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }
    public Result<PagedResult<IngredientDto>> GetPagedWithMeasurementUnit(int page, int pageSize)
    {
        var result = _ingredientRepository.GetPagedWithMeasurementUnit(page, pageSize);
        return MapToDto(result);
    }
    public Result Delete(int ingredientId)
    {
        Meal meal = _mealRepository.FindFirstWithIngredient(ingredientId);
        if (meal != null)
            return Result.Fail(FailureCode.Forbidden).WithError("It is not allowed to delete ingredient, it is connected to meal.");
        _ingredientRepository.Delete(ingredientId);
        return Result.Ok();
    }

    public Result<List<IngredientDto>> GetAll()
    {
        var result = _ingredientRepository.GetAll();
        return MapToDto(result);
    }
}
