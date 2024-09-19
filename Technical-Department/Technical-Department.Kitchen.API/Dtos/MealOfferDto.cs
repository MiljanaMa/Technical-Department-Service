using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;

public class MealOfferDto
{
    public MealType Type { get; set; }
    public ConsumerType ConsumerType { get; set; }
    public long MealId { get; set; }
    public string MealName { get; set; }
    public double? Calories { get; set; }
    public int ConsumerQuantity { get; set; }
    public long DailyMenuId { get; set; }

}
