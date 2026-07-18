using ImobiCrm.Api.Enums;

namespace ImobiCrm.Api.Models;

public class Client
{
    public int Id { get; set; }
    public ClientType Type { get; set; }
    public string Name { get; set; } = null!;
    public string Document { get; set; } = null!;
    public string? Observations { get; set; }
    public bool Active { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? LeadOriginId { get; set; }
    public ICollection<ClientPhone> Phones { get; set; } = new List<ClientPhone>();
    public ICollection<ClientEmail> Emails { get; set; } = new List<ClientEmail>();
    public ICollection<ClientServiceHistory> ServiceHistories { get; set; } = new List<ClientServiceHistory>();
    public ICollection<ClientProperty> Properties { get; set; } = new List<ClientProperty>();
    public ICollection<ClientAddress> Addresses { get; set; } = new List<ClientAddress>();
}
