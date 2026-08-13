using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class ClientPropertyEndpoints
{
    public static void MapClientPropertyEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clients/{id:int}/properties", async (int id, ApplicationDbContext db) =>
        {
            var clientProperties = await db.ClientProperties.Include(cp => cp.Property).Where(cp => cp.ClientId == id).ToListAsync();

            return Results.Ok(clientProperties);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{clientId:int}/properties/{propertyId:int}", async (int clientId, int propertyId, ClientPropertyCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var client = await db.Clients.FindAsync(clientId);
            if (client is null) return Results.NotFound();

            var property = await db.Properties.FindAsync(propertyId);
            if (property is null) return Results.NotFound();

            var existingClientProperty = await db.ClientProperties.SingleOrDefaultAsync(cp => cp.ClientId == clientId && cp.PropertyId == propertyId);
            if (existingClientProperty is not null) return Results.Conflict(new { error = "Este imóvel já está associado a este cliente" });

            var clientProperty = new ClientProperty
            {
                ClientId = clientId,
                PropertyId = propertyId,
                RelationType = dto.RelationType
            };

            db.ClientProperties.Add(clientProperty);
            await db.SaveChangesAsync();

            return Results.Created($"/api/clients/{clientId}/properties/{propertyId}", clientProperty);
        }).RequireAuthorization();

        app.MapPut("/api/clients/{clientId:int}/properties/{propertyId:int}", async (int clientId, int propertyId, ClientPropertyUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientProperty = await db.ClientProperties.SingleOrDefaultAsync(cp => cp.ClientId == clientId && cp.PropertyId == propertyId);
            if (clientProperty is null) return Results.NotFound();

            clientProperty.RelationType = dto.RelationType;

            await db.SaveChangesAsync();

            return Results.Ok(clientProperty);
        }).RequireAuthorization();

        app.MapDelete("/api/clients/{clientId:int}/properties/{propertyId:int}", async (int clientId, int propertyId, ApplicationDbContext db) =>
        {
            var clientProperty = await db.ClientProperties.SingleOrDefaultAsync(cp => cp.ClientId == clientId && cp.PropertyId == propertyId);
            if (clientProperty is null) return Results.NotFound();

            db.ClientProperties.Remove(clientProperty);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();
    }
}