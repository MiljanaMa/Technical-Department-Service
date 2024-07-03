namespace Technical_Department.Kitchen.API.Dtos;

public class IngredientQuantityDto
{
    public long IngredientId { get; set; }
    public IngredientDto Ingredient { get; set; }
    public double Quantity { get; set; }
}
