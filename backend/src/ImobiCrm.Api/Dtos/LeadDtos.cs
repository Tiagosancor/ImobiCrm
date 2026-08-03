using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record LeadCreateDto(
	int? PropertyId,
	[property: Required] string Name,
	[property: EmailAddress] string? Email,
	string? Phone,
	string? Message
);

public record LeadStatusUpdateDto(string Status);
