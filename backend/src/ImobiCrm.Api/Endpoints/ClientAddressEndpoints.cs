using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class ClientAddressEndpoints
{
    public static void MapClientAddressEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clients/{id:int}/addresses", async (int id, ApplicationDbContext db) =>
        {
            var clientAddresses = await db.ClientAddresses.Where(a => a.ClientId == id).ToListAsync();
            return Results.Ok(clientAddresses);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{id:int}/addresses", async (int id, ClientAddressCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientAddress = new ClientAddress
            {
                ClientId = id,
                Street = dto.Street,
                Number = dto.Number,
                Complement = dto.Complement,
                Neighborhood = dto.Neighborhood,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                IsMain = dto.IsMain
            };

            db.ClientAddresses.Add(clientAddress);
            await db.SaveChangesAsync();

            return Results.Created($"/api/clients/{id}/addresses/{clientAddress.Id}", clientAddress);
        }).RequireAuthorization();

        app.MapPut("/api/clients/{clientId:int}/addresses/{addressId:int}", async (int clientId, int addressId, ClientAddressUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientAddress = await db.ClientAddresses.SingleOrDefaultAsync(a => a.Id == addressId && a.ClientId == clientId);
            if (clientAddress == null) return Results.NotFound();

            clientAddress.Street = dto.Street;
            clientAddress.Number = dto.Number;
            clientAddress.Complement = dto.Complement;
            clientAddress.Neighborhood = dto.Neighborhood;
            clientAddress.City = dto.City;
            clientAddress.State = dto.State;
            clientAddress.ZipCode = dto.ZipCode;
            clientAddress.IsMain = dto.IsMain;

            await db.SaveChangesAsync();
            return Results.Ok(clientAddress);
        }).RequireAuthorization();

        app.MapDelete("/api/clients/{clientId:int}/addresses/{addressId:int}", async (int clientId, int addressId, ApplicationDbContext db) =>
        {
            var clientAddress = await db.ClientAddresses.SingleOrDefaultAsync(a => a.Id == addressId && a.ClientId == clientId);
            if (clientAddress == null) return Results.NotFound();

            db.ClientAddresses.Remove(clientAddress);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();
    }
}