
using BuildingBlocks.Core.Domain;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class Ingredient : Entity
    {
        public required string Name { get; init; }
        public double Calories { get; set; }
        public double Proteins { get; set; }
        public double Carbohydrates { get; set; }
        public double Fats { get; set; }
        public double Sugar { get; set; }
        public IngredientType Type { get; init; }
        public long UnitId { get; init; }
        public MeasurementUnit Unit { get; init; }
    }
}
