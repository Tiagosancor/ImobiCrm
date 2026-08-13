using System.Text.Json.Serialization;

using ImobiCrm.Api.Enums;

namespace ImobiCrm.Api.Models;

public class ClientProperty
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public int PropertyId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ClientPropertyRelationType RelationType { get; set; }

    [JsonIgnore]
    public Client? Client { get; set; }
    public Property? Property { get; set; }
}