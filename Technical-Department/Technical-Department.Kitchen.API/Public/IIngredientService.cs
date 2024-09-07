using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IIngredientService
    {
        Result<IngredientDto> Create(IngredientDto ingredient);
        Result<IngredientDto> Update(IngredientDto ingredient);
        Result Delete(int ingredientId);
        Result<IngredientDto> Get(int id);
        Result<List<IngredientDto>> GetAll();
        Result<PagedResult<IngredientDto>> GetPagedWithMeasurementUnit(int page, int pageSize);
    }
}
