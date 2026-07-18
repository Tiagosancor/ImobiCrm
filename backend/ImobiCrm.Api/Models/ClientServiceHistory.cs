namespace ImobiCrm.Api.Models;

public class ClientServiceHistory
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    public Client? Client { get; set; }

    public User? User { get; set; }
}