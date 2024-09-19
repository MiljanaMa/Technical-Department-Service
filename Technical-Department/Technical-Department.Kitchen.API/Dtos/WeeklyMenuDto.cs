using Technical_Department.Kitchen.API.Dtos.Enums;

namespace Technical_Department.Kitchen.API.Dtos;

public class WeeklyMenuDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public DateOnly From { get; set; }
    public DateOnly To { get; set; }
    public ICollection<DailyMenuDto>? Menu { get; set; }
    public WeeklyMenuStatus Status { get; set; }
}
