using BuildingBlocks.Core.UseCases;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.API.Dtos;

namespace Technical_Department.Kitchen.API.Public
{
    public interface IMeasurementUnitService
    {
        Result<PagedResult<MeasurementUnitDto>> GetPaged(int page, int pageSize);
        Result<MeasurementUnitDto> Get(int id);
    }
}
