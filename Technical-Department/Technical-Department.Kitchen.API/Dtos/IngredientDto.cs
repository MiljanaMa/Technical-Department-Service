using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;
public class IngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public double Calories { get; set; }
    public double Proteins { get; set; }
    public double Carbohydrates { get; set; }
    public double Fats { get; set; }
    public double Sugar { get; set; }
    public IngredientType Type { get; set; }
    public int UnitId { get; set; }
    public MeasurementUnitDto Unit { get; set; }
}
