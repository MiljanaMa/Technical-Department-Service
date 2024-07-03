using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;

public class MealOfferDto
{
    public MealType Type { get; set; }
    public ConsumerType ConsumerType { get; set; }
    public long MealId { get; set; }
    public MealDto Meal { get; set; }
    public int ConsumerQuantity { get; set; }
}
