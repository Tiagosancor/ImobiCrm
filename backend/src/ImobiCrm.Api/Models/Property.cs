namespace ImobiCrm.Api.Models;

public class Property
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int? Bedrooms { get; set; }
    public int? Bathrooms { get; set; }
    public int? GarageSpaces { get; set; }
    public double? Area { get; set; }
    public string? City { get; set; }
    public string? Neighborhood { get; set; }
    public bool Active { get; set; } = true;
    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
