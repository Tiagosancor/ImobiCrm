namespace ImobiCrm.Api.Models;

public class ClientAddress
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string Street { get; set; } = null!;
    public string? Number { get; set; }
    public string? Complement { get; set; }
    public string Neighborhood { get; set; } = null!;
    public string City { get; set; } = null!;
    public string State { get; set; } = null!;
    public string ZipCode { get; set; } = null!;
     public bool IsMain { get; set; }

    public Client? Client { get; set; }
    
}