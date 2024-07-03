namespace Technical_Department.Kitchen.API.Dtos;

public class DailyMenuDto
{
    public Enums.DayOfWeek DayOfWeek { get; set; }
    public ICollection<MealOfferDto> Menu { get; set; }
}
