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
    public KitchenWarehouseService(IKitchenWarehouseRepository kitchenWarehouseRepository, IMapper mapper) : base(kitchenWarehouseRepository, mapper)
    {
        _kitchenWarehouseRepository = kitchenWarehouseRepository;
    }
    public Result<List<KitchenWarehouseIngredientDto>> StartNewBusinessYear(List<KitchenWarehouseIngredientDto> ingredients)
    {
        try
        {
            return ingredients;

        }
        catch(Exception ex)
        {
            return Result.Fail(FailureCode.InvalidArgument).WithError(ex.Message);
        }
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
