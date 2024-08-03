using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;

public class ConsumerQuantityDto
{
    public MealType Type { get; set; }
    public ConsumerType ConsumerType { get; set; }
    public int ConsumerQuantity { get; set; }

}
