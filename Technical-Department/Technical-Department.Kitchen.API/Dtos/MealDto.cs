using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;

public class MealDto
{
    public long Id { get; set; }
    public int Code { get; set; }
    public string Name { get; set; }
    public double Calories { get; set; }
    public DateTime StandardizationDate { get; set; }
    public ICollection<DishType> Types { get; set; }
    public ICollection<IngredientQuantityDto> Ingredients { get; set; }
}
