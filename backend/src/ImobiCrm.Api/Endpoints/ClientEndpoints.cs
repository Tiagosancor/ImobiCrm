using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class ClientEndpoints
{
    public static void MapClientEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clients", async (ApplicationDbContext db,
            [FromQuery] string? name,
            [FromQuery] string? document,
            [FromQuery] bool includeInactive = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20) =>
        {
            var query = db.Clients.AsQueryable();
            if (!includeInactive) query = query.Where(c => c.Active);

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(c => c.Name.ToLower().Contains(name.ToLower()));
            if (!string.IsNullOrWhiteSpace(document))
                query = query.Where(c => c.Document.ToLower().Contains(document.ToLower()));

            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Results.Ok(new { total, page, pageSize, items });
        }).RequireAuthorization();    
        
        app.MapPost("/api/clients", async (ClientCreateDto dto, ApplicationDbContext db) =>
        {
           if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);
           
           var client = new ImobiCrm.Api.Models.Client
           {
               Name = dto.Name,
               Document = dto.Document,
               Type = dto.Type,
               Observations = dto.Observations,
               LeadOriginId = dto.LeadOriginId,
               Active = true
           };
           db.Clients.Add(client);
           await db.SaveChangesAsync();
           return Results.Created($"/api/clients/{client.Id}", client);
        }).RequireAuthorization();

        app.MapGet("/api/clients/{id:int}", async (int id, ApplicationDbContext db) =>
        {
            var client = await db.Clients.SingleOrDefaultAsync(c => c.Id == id);
            if (client == null) return Results.NotFound();

            return Results.Ok(client);
        }).RequireAuthorization();

        app.MapPut("/api/clients/{id:int}", async (int id, ClientUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var client = await db.Clients.FindAsync(id);
            if (client == null) return Results.NotFound();

            client.Name = dto.Name;
            client.Document = dto.Document;
            client.Type = dto.Type;
            client.Observations = dto.Observations;
            client.LeadOriginId = dto.LeadOriginId;
            client.Active = dto.Active;

            await db.SaveChangesAsync();
            return Results.Ok(client);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{id:int}/activate", async (int id, ApplicationDbContext db) =>
        {
            var client = await db.Clients.FindAsync(id);
            if (client == null) return Results.NotFound();
            client.Active = true;
            await db.SaveChangesAsync();
            return Results.Ok(client);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{id:int}/deactivate", async (int id, ApplicationDbContext db) =>
        {
            var client = await db.Clients.FindAsync(id);
            if (client == null) return Results.NotFound();
            client.Active = false;
            await db.SaveChangesAsync();
            return Results.Ok(client);
        }).RequireAuthorization();
    }
}