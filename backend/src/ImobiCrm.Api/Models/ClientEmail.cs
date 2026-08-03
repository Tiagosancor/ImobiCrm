namespace ImobiCrm.Api.Models;

public class ClientEmail
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string EmailAddress { get; set; } = null!;
    public bool IsMain { get; set; }

    public Client? Client { get; set; }
}