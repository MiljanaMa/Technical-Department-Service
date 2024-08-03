namespace Technical_Department.Kitchen.API.Dtos;

public class IngredientQuantityDto
{
    public int IngredientId { get; set; }
    public string IngredientName { get; set; }
    public string UnitShortName { get; set; }
    public double Quantity { get; set; }

    public IngredientQuantityDto(int ingredientId = 0, string ingredientName = null, string unitShortName = null, double quantity = 0.0)
    {
        this.IngredientId = ingredientId;
        this.IngredientName = ingredientName;
        this.UnitShortName = unitShortName;
        this.Quantity = quantity;
    }


}
