using System.Text.Json.Serialization;

namespace ImobiCrm.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    [JsonIgnore]
    public string PasswordHash { get; set; } = null!;
}
