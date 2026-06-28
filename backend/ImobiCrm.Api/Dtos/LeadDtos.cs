namespace ImobiCrm.Api.Dtos;

public record LeadCreateDto(int? PropertyId, string Name, string? Email, string? Phone, string? Message);
public record LeadStatusUpdateDto(string Status);
