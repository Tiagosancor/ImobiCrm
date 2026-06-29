using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Dtos;

public record RegisterDto(
	[property: Required] string Name,
	[property: Required] [property: EmailAddress] string Email,
	[property: Required] [property: MinLength(6)] string Password
);

public record LoginDto(
	[property: Required] [property: EmailAddress] string Email,
	[property: Required] string Password
);

public record ChangePasswordDto(string CurrentPassword, string NewPassword);
public record RecoverDto(string Email);
public record ResetDto(string Token, string NewPassword);
