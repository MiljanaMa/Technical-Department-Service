using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Core.UseCases;

public class WarehouseService : CrudService<WarehouseIngredientDto, WarehouseIngredient>, IWarehouseService
{
    private readonly IWarehouseRepository _warehouseRepository;
    private readonly IIngredientRepository _ingredientRepository;
    private readonly IIngredientRequirementService _ingredientRequirementService;
    public WarehouseService(IWarehouseRepository kitchenWarehouseRepository, IIngredientRepository ingredientRepository,
        IIngredientRequirementService ingredientRequirementService,
        IMapper mapper) : base(kitchenWarehouseRepository, mapper)
    {
        _warehouseRepository = kitchenWarehouseRepository;
        _ingredientRepository = ingredientRepository;
        _ingredientRequirementService = ingredientRequirementService;
    }
    public Result<List<WarehouseIngredientDto>> StartNewBusinessYear(List<WarehouseIngredientDto> ingredients)
    {
        try
        {
            var newIngredients = UpdateWarehouseIngredients(MapToDomain(ingredients));
            var result = _warehouseRepository.AddNewWarehouseIngredients(newIngredients);
            var ingredientIds = ingredients.Select(i => i.IngredientId).ToList();
            _ingredientRepository.SyncIngredientsStatuses(ingredientIds);

            return MapToDto(result);
        }
        catch (Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }

    private List<WarehouseIngredient> UpdateWarehouseIngredients(List<WarehouseIngredient> ingredients)
    {
        foreach (var ingredient in ingredients)
        {
            var dbIngredient = _ingredientRepository.Get(ingredient.IngredientId);
            ingredient.Update(dbIngredient);
        }
        return ingredients;
    }

    public Result<List<WarehouseIngredientDto>> GetAll()
    {
        try
        {
            var result = _warehouseRepository.GetAll();
            return MapToDto(result);

        }
        catch (Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }
    public Result UpdateWarehouse(List<IngredientQuantityDto> deliveryNoteIngredients)
    {
        try
        {
            List<IngredientQuantityDto>  requirementIngredients = _ingredientRequirementService.GetIngredientRequirements().Value;
            var updatedIngredients = new List<WarehouseIngredient>();
            foreach (var deliveryNoteIngredient in deliveryNoteIngredients)
            {
                var kitchenWarehouseIngredient = _warehouseRepository.GetByWarehouseLabel(deliveryNoteIngredient.IngredientName);

                if (kitchenWarehouseIngredient != null)
                {
                    var requirementIngredient = requirementIngredients.FirstOrDefault(r => r.IngredientId == kitchenWarehouseIngredient.IngredientId);

                    if (requirementIngredient != null)
                    {
                        kitchenWarehouseIngredient.UpdateQuantity(deliveryNoteIngredient.Quantity, requirementIngredient.Quantity);
                        updatedIngredients.Add(kitchenWarehouseIngredient);
                    }
                }
                else
                {
                    return Result.Fail(FailureCode.NotFound).WithError($"Namirnica sa imenom {deliveryNoteIngredient.IngredientName} ne postoji!");
                }
            }
            _warehouseRepository.UpdateIngredients(updatedIngredients);

            return Result.Ok();
        }
        catch (Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
    }
}
