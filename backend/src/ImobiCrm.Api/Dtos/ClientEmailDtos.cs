using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record ClientEmailCreateDto(
    [property: Required] [property: EmailAddress] string Email,
    bool IsMain
);

public record ClientEmailUpdateDto(
    [property: Required] [property: EmailAddress] string Email,
    bool IsMain
);