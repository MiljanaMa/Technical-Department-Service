namespace Technical_Department.Kitchen.API.Dtos;

public class IngredientQuantityDto
{
    public int IngredientId { get; set; }
    public string IngredientName { get; set; }
    public string UnitShortName { get; set; }
    public double Quantity { get; set; }
}
