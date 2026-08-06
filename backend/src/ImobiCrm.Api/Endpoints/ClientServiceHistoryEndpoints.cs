using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class ClientServiceHistoryEndpoints
{
    public static void MapClientServiceHistoryEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clients/{id:int}/service-history", async (int id, ApplicationDbContext db) =>
        {
            var serviceHistory = await db.ClientServiceHistories
                .Where(sh => sh.ClientId == id)
                .OrderByDescending(sh => sh.CreatedAt)
                .ToListAsync();

            return Results.Ok(serviceHistory);
        }).RequireAuthorization();

        app.MapPost("/api/clients/{id:int}/service-history", async (int id, ClientServiceHistoryCreateDto dto, HttpContext ctx, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var idClaim = ctx.User.Claims.FirstOrDefault(c => c.Type == "id");
            if (idClaim == null) return Results.Unauthorized();
            if (!int.TryParse(idClaim.Value, out var userId)) return Results.Unauthorized();

            var serviceHistory = new ClientServiceHistory
            {
                ClientId = id,
                UserId = userId,
                Notes = dto.Notes
            };

            db.ClientServiceHistories.Add(serviceHistory);
            await db.SaveChangesAsync();

            return Results.Created($"/api/clients/{id}/service-history/{serviceHistory.Id}", serviceHistory);
        }).RequireAuthorization();
    }
}