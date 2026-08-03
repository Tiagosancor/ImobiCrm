using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record ClientAddressCreateDto(
    [property: Required] [property: MaxLength(100)] string Street,
    [property: MaxLength(10)] string? Number,
    [property: MaxLength(50)] string? Complement,
    [property: Required] [property: MaxLength(50)] string Neighborhood,
    [property: Required] [property: MaxLength(50)] string City,
    [property: Required] [property: MaxLength(2)] string State,
    [property: Required] [property: MaxLength(10)] string ZipCode,
    bool IsMain
);

public record ClientAddressUpdateDto(
    [property: Required] [property: MaxLength(100)] string Street,
    [property: MaxLength(10)] string? Number,
    [property: MaxLength(50)] string? Complement,
    [property: Required] [property: MaxLength(50)] string Neighborhood,
    [property: Required] [property: MaxLength(50)] string City,
    [property: Required] [property: MaxLength(2)] string State,
    [property: Required] [property: MaxLength(10)] string ZipCode,
    bool IsMain
);