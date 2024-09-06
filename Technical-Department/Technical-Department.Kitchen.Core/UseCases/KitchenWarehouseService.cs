using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Core.UseCases;

public class KitchenWarehouseService : CrudService<KitchenWarehouseIngredientDto, KitchenWarehouseIngredient>, IKitchenWarehouseService
{
    private readonly IKitchenWarehouseRepository _kitchenWarehouseRepository;
    private readonly IIngredientRepository _ingredientRepository;
    public KitchenWarehouseService(IKitchenWarehouseRepository kitchenWarehouseRepository, IIngredientRepository ingredientRepository,
        IMapper mapper) : base(kitchenWarehouseRepository, mapper)
    {
        _kitchenWarehouseRepository = kitchenWarehouseRepository;
        _ingredientRepository = ingredientRepository;
    }
    public Result<List<KitchenWarehouseIngredientDto>> StartNewBusinessYear(List<KitchenWarehouseIngredientDto> ingredients)
    {
        try
        {
            var newIngredients = CreateWarehouseIngredients(MapToDomain(ingredients));
            _kitchenWarehouseRepository.AddNewWarehouse(newIngredients);
            var ingredientIds = ingredients.Select(i => i.IngredientId).ToList();
            _ingredientRepository.UpdateIngredientsStatus(ingredientIds);

            var result = _kitchenWarehouseRepository.GetAll();
            return MapToDto(result);
        }
        catch (Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }

    private List<KitchenWarehouseIngredient> CreateWarehouseIngredients(List<KitchenWarehouseIngredient> ingredients)
    {
        var newIngredients = new List<KitchenWarehouseIngredient>();
        foreach (var ingredient in ingredients)
        {
            var dbIngredient = _ingredientRepository.Get(ingredient.IngredientId);
            ingredient.Create(dbIngredient);
            newIngredients.Add(ingredient);
        }
        return newIngredients;
    }

    public Result<List<KitchenWarehouseIngredientDto>> GetAll()
    {
        try
        {
            var result = _kitchenWarehouseRepository.GetAll();
            return MapToDto(result);

        }
        catch (Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }

    }
}
