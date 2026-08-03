using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record ClientPhoneCreateDto(
    [property: Required] [property: MaxLength(20)] string PhoneNumber,
    bool IsWhatsapp,
    bool IsMain
);

public record ClientPhoneUpdateDto(
    [property: Required] [property: MaxLength(20)] string PhoneNumber,
    bool IsWhatsapp,
    bool IsMain
);