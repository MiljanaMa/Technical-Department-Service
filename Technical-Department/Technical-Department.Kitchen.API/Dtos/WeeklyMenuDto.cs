namespace Technical_Department.Kitchen.API.Dtos;

public class WeeklyMenuDto
{
    public DateOnly From { get; set; }
    public DateOnly To { get; set; }
    public ICollection<DailyMenuDto> Menu { get; set; }
}
