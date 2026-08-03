using System.ComponentModel.DataAnnotations;
using ImobiCrm.Api.Enums;

namespace ImobiCrm.Api.Dtos;

public record ClientCreateDto(
    [property: Required] [property: MaxLength(100)] string Name,
    [property: Required] [property: MaxLength(20)] string Document,
    [property: Required] [property: EnumDataType(typeof(ClientType))] ClientType Type,
    string? Observations,
    int? LeadOriginId
);

public record ClientUpdateDto(
    [property: Required] [property: MaxLength(100)] string Name,
    [property: Required] [property: MaxLength(20)] string Document,
    [property: Required] [property: EnumDataType(typeof(ClientType))] ClientType Type,
    string? Observations,
    bool Active,
    int? LeadOriginId
);


