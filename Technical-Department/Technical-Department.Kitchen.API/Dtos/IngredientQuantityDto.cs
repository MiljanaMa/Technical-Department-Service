namespace Technical_Department.Kitchen.API.Dtos;

public class IngredientQuantityDto
{
    public long IngredientId { get; set; }
    public string IngredientName { get; set; }
    public long MealId { get; set; }
    public double Quantity { get; set; }
}
