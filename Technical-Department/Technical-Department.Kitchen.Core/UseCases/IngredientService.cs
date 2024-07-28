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
    public IngredientService(IIngredientRepository ingredientRepository, IMapper mapper) : base(ingredientRepository, mapper)
    {
        _ingredientRepository = ingredientRepository;
    }
}
