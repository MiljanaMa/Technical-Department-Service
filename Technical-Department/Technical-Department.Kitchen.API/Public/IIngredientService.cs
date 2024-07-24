using FluentResults;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IIngredientService
    {
        Result<IngredientDto> GetAllBy();
        Result<IngredientDto> Create(IngredientDto ingredient);
        Result<IngredientDto> Update(IngredientDto ingredient);
        Result<IngredientDto> Get(long id);
    }
}
