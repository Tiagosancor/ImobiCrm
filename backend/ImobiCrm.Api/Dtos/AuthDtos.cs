namespace ImobiCrm.Api.Dtos;

public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);
public record RecoverDto(string Email);
public record ResetDto(string Token, string NewPassword);
