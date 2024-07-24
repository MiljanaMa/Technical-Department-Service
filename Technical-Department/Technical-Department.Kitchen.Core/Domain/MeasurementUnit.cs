using BuildingBlocks.Core.Domain;
using Explorer.BuildingBlocks.Core.Domain;
using System.Text.Json.Serialization;


namespace Technical_Department.Kitchen.Core.Domain
{
    public class MeasurementUnit : Entity
    {
        public string Name { get; init; }
        public string ShortName { get; init; }
    }
}
