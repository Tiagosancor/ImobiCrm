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

public record ChangePasswordDto(
	[property: Required] string CurrentPassword,
	[property: Required] [property: MinLength(6)] string NewPassword
);
public record RecoverDto(
	[property: Required] [property: EmailAddress] string Email
);
public record ResetDto(
[property: Required] string Token,
[property: Required] [property: MinLength(6)] string NewPassword
);
