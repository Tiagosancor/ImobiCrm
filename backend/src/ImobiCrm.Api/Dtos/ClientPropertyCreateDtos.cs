using System.ComponentModel.DataAnnotations;
using ImobiCrm.Api.Enums;

namespace ImobiCrm.Api.Dtos;

public record ClientPropertyCreateDto(
    [property: Required] [property: EnumDataType(typeof(ClientPropertyRelationType))] ClientPropertyRelationType RelationType
);