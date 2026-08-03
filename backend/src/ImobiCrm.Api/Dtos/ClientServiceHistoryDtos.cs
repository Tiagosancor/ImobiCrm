using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record ClientServiceHistoryCreateDto(
    [property: Required] string Notes
);