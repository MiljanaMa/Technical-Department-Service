using AutoMapper;
using BuildingBlocks.Core.UseCases;
using FluentResults;
using Technical_Department.Kitchen.API.Dtos;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;

namespace Technical_Department.Kitchen.Core.UseCases;

public class MeasurementUnitService : CrudService<MeasurementUnitDto, MeasurementUnit>, IMeasurementUnitService
{
    private readonly IMeasurementUnitRepository _measurementUnitRepository;
    public MeasurementUnitService(IMeasurementUnitRepository measurementUnitRepository, IMapper mapper) : base(measurementUnitRepository, mapper)
    {
        _measurementUnitRepository = measurementUnitRepository;
    }
}
