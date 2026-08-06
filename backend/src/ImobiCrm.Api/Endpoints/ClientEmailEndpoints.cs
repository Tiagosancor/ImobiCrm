using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class ClientEmailEndpoints
{
    public static void MapClientEmailEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clients/{id:int}/emails", async (int id, ApplicationDbContext db) =>
        {
            var clientEmails = await db.ClientEmails.Where(e => e.ClientId == id).ToListAsync();
            return Results.Ok(clientEmails);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{id:int}/emails", async (int id, ClientEmailCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientEmail = new ClientEmail
            {
                ClientId = id,
                EmailAddress = dto.Email,
                IsMain = dto.IsMain
            };

            db.ClientEmails.Add(clientEmail);
            await db.SaveChangesAsync();

            return Results.Created($"/api/clients/{id}/emails/{clientEmail.Id}", clientEmail);
        }).RequireAuthorization();

        app.MapPut("/api/clients/{clientId:int}/emails/{emailId:int}", async (int clientId, int emailId, ClientEmailUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var clientEmail = await db.ClientEmails.SingleOrDefaultAsync(e => e.Id == emailId && e.ClientId == clientId);
            if (clientEmail == null) return Results.NotFound();

            clientEmail.EmailAddress = dto.Email;
            clientEmail.IsMain = dto.IsMain;

            await db.SaveChangesAsync();
            return Results.Ok(clientEmail);
        }).RequireAuthorization();

        app.MapDelete("/api/clients/{clientId:int}/emails/{emailId:int}", async (int clientId, int emailId, ApplicationDbContext db) =>
        {
            var clientEmail = await db.ClientEmails.SingleOrDefaultAsync(e => e.Id == emailId && e.ClientId == clientId);
            if (clientEmail == null) return Results.NotFound();

            db.ClientEmails.Remove(clientEmail);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();
    }
}