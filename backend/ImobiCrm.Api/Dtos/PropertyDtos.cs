namespace ImobiCrm.Api.Dtos;

public record PropertyCreateDto(
    string Title,
    string? Description,
    decimal Price,
    int? Bedrooms,
    int? Bathrooms,
    int? GarageSpaces,
    double? Area,
    string? City,
    string? Neighborhood
);

public record PropertyUpdateDto(
    string Title,
    string? Description,
    decimal Price,
    int? Bedrooms,
    int? Bathrooms,
    int? GarageSpaces,
    double? Area,
    string? City,
    string? Neighborhood,
    bool Active
);
