

using BuildingBlocks.Core.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using Technical_Department.Kitchen.Core.Domain.Enums;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class Meal: Entity
    {
        public int Code { get; init; }
        public required string Name { get; init; }
        public double Calories { get; init; }
        public DateTime StandardizationDate { get; init; }
        public bool IsBreadIncluded { get; init; }
        public string DishTypes;

        [NotMapped]
        public ICollection<DishType> Types
        {
            get => string.IsNullOrEmpty(DishTypes)
                    ? new List<DishType>()
                    : DishTypes.Split(',').Select(Enum.Parse<DishType>).ToList();
            set => DishTypes = string.Join(",", value.Select(dt => dt.ToString()));
        }
        public ICollection<IngredientQuantity> Ingredients { get; init; }
    }
}
