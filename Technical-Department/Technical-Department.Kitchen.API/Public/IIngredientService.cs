using FluentResults;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IIngredientService
    {
        Result<IngredientDto> GetAll();
    }
}
