
using BuildingBlocks.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class Ingredient : Entity
    {
        public required string Name { get; init; }
        public double Calories { get; set; }
        public IngredientType Type { get; init; }
        public long UnitId { get; init; }
        public MeasurementUnit Unit { get; init; }
    }
}
