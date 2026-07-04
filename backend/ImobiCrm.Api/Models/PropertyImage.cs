namespace ImobiCrm.Api.Models;

public class PropertyImage
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string FileName { get; set; } = null!;

    public Property? Property { get; set; }
    public int Order { get; set; }
    public bool IsMain { get; set; }
}
