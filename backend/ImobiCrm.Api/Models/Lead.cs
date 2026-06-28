namespace ImobiCrm.Api.Models;

public class Lead
{
    public int Id { get; set; }
    public int? PropertyId { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = "Novo";

    public Property? Property { get; set; }
}
