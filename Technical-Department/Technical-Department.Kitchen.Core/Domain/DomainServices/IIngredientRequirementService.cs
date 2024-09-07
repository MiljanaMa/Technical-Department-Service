using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.Core.Domain;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IIngredientRequirementService
    {
        Result<List<IngredientQuantityDto>> GetIngredientRequirements();
    }
}
