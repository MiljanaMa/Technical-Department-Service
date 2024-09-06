using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;

public class KitchenWarehouseIngredientDto
{
    public long IngredientId { get; set; }
    public IngredientDto Ingredient { get; set; }
    public string WarehouseLabel { get; set; }
    public double Quantity { get; set; }
    public double MeasurementUnitScale { get; set; }

}
