namespace Technical_Department.Kitchen.API.Dtos;

public class DailyMenuDto
{
    public long Id { get; set; }
    public Enums.DayOfWeek DayOfWeek { get; set; }
    public ICollection<MealOfferDto> Menu { get; set; }
    public long WeeklyMenuId { get; set; }
}
