using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class ClientPhoneEndpoints
{
    public static void MapClientPhoneEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clients/{id:int}/phones", async (int id, ApplicationDbContext db) =>
        {
            var clientPhones = await db.ClientPhones.Where(p => p.ClientId == id).ToListAsync();
            return Results.Ok(clientPhones);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{id:int}/phones", async (int id, ClientPhoneCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientPhone = new ClientPhone
            {
                ClientId = id,
                PhoneNumber = dto.PhoneNumber,
                IsWhatsapp = dto.IsWhatsapp,
                IsMain = dto.IsMain
            };

            db.ClientPhones.Add(clientPhone);
            await db.SaveChangesAsync();

            return Results.Created($"/api/clients/{id}/phones/{clientPhone.Id}", clientPhone);
        }).RequireAuthorization();

        app.MapPut("/api/clients/{clientId:int}/phones/{phoneId:int}", async (int clientId, int phoneId, ClientPhoneUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientPhone = await db.ClientPhones.SingleOrDefaultAsync(p => p.Id == phoneId && p.ClientId == clientId);
            if (clientPhone == null) return Results.NotFound();

            clientPhone.PhoneNumber = dto.PhoneNumber;
            clientPhone.IsWhatsapp = dto.IsWhatsapp;
            clientPhone.IsMain = dto.IsMain;

            await db.SaveChangesAsync();
            return Results.Ok(clientPhone);
        }).RequireAuthorization();

        app.MapDelete("/api/clients/{clientId:int}/phones/{phoneId:int}", async (int clientId, int phoneId, ApplicationDbContext db) =>
        {
            var clientPhone = await db.ClientPhones.SingleOrDefaultAsync(p => p.Id == phoneId && p.ClientId == clientId);
            if (clientPhone == null) return Results.NotFound();

            db.ClientPhones.Remove(clientPhone);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();
    }
}