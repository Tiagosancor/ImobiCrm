using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class LeadEndpoints
{
    private static readonly string[] AllowedStatuses = 
        { "Novo", "Contatado", "Visita Agendada", "Fechado", "Perdido" };
        
    public static void MapLeadEndpoints(this WebApplication app)
    {
        app.MapPost("/api/leads", async (LeadCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var lead = new Lead
            {
                PropertyId = dto.PropertyId,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Message = dto.Message,
                Status = "Novo"
            };
            db.Leads.Add(lead);
            await db.SaveChangesAsync();
            return Results.Created($"/api/leads/{lead.Id}", lead);
        });

        app.MapGet("/api/leads", async (ApplicationDbContext db) =>
            await db.Leads.OrderByDescending(l => l.CreatedAt).ToListAsync()).RequireAuthorization();

        app.MapGet("/api/leads/{id}", async (int id, ApplicationDbContext db) =>
        {
            var lead = await db.Leads.Include(l => l.Property).SingleOrDefaultAsync(l => l.Id == id);
            return lead == null ? Results.NotFound() : Results.Ok(lead);
        }).RequireAuthorization();

        app.MapPut("/api/leads/{id}/status", async (int id, LeadStatusUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!AllowedStatuses.Contains(dto.Status)) return Results.BadRequest(new { error = "Status inválido" });
            var lead = await db.Leads.FindAsync(id);
            if (lead == null) return Results.NotFound();
            lead.Status = dto.Status;
            await db.SaveChangesAsync();
            return Results.Ok(lead);
        }).RequireAuthorization();

        app.MapPut("/api/leads/{id}", async (int id, LeadCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var lead = await db.Leads.FindAsync(id);
            if (lead == null) return Results.NotFound();
            lead.Name = dto.Name;
            lead.Email = dto.Email;
            lead.Phone = dto.Phone;
            lead.Message = dto.Message;
            lead.PropertyId = dto.PropertyId;
            await db.SaveChangesAsync();
            return Results.Ok(lead);
        }).RequireAuthorization();
    }
}