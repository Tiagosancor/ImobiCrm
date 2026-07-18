namespace ImobiCrm.Api.Models;

public class ClientPhone
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public bool IsWhatsapp { get; set; }
    public bool IsMain { get; set; }

    public Client? Client { get; set; } 
}