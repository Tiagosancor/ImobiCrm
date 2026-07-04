using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record PropertyCreateDto(
    [property: Required] [property: MaxLength(300)] string Title,
    string? Description,
    [property: Range(0.01, double.MaxValue)] decimal Price,
    [property: Range(0, 100)] int? Bedrooms,
    [property: Range(0, 100)] int? Bathrooms,
    [property: Range(0, 100)] int? GarageSpaces,
    [property: Range(0.01, double.MaxValue)] double? Area,
    string? City,
    string? Neighborhood
);

public record PropertyUpdateDto(
    [property: Required] [property: MaxLength(300)] string Title,
    string? Description,
    [property: Range(0.01, double.MaxValue)] decimal Price,
    [property: Range(0, 100)] int? Bedrooms,
    [property: Range(0, 100)] int? Bathrooms,
    [property: Range(0, 100)] int? GarageSpaces,
    [property: Range(0.01, double.MaxValue)] double? Area,
    string? City,
    string? Neighborhood,
    bool Active
);

public class ImageOrderDto
{
    public List<int> ImageIds { get; set; } = new();
}