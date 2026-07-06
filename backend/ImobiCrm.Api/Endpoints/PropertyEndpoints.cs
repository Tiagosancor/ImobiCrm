using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Endpoints;

public static class PropertyEndpoints
{
    public static void MapPropertyEndpoints(this WebApplication app, string uploadPath)
    {
        app.MapGet("/api/properties", async (ApplicationDbContext db,
            [FromQuery] string? city,
            [FromQuery] string? neighborhood,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? bedrooms,
            [FromQuery] int? bathrooms,
            [FromQuery] double? minArea,
            [FromQuery] double? maxArea,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20) =>
        {
            var query = db.Properties.AsQueryable();
            query = query.Where(p => p.Active);

            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(p => p.City != null && p.City.ToLower().Contains(city.ToLower()));
            if (!string.IsNullOrWhiteSpace(neighborhood))
                query = query.Where(p => p.Neighborhood != null && p.Neighborhood.ToLower().Contains(neighborhood.ToLower()));
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);
            if (bedrooms.HasValue)
                query = query.Where(p => p.Bedrooms == bedrooms.Value);
            if (bathrooms.HasValue)
                query = query.Where(p => p.Bathrooms == bathrooms.Value);
            if (minArea.HasValue)
                query = query.Where(p => p.Area >= minArea.Value);
            if (maxArea.HasValue)
                query = query.Where(p => p.Area <= maxArea.Value);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Results.Ok(new { total, page, pageSize, items });
        });

        app.MapPost("/api/properties", async (PropertyCreateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var prop = new ImobiCrm.Api.Models.Property
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                Bedrooms = dto.Bedrooms,
                Bathrooms = dto.Bathrooms,
                GarageSpaces = dto.GarageSpaces,
                Area = dto.Area,
                City = dto.City,
                Neighborhood = dto.Neighborhood,
                Active = true
            };
            db.Properties.Add(prop);
            await db.SaveChangesAsync();
            return Results.Created($"/api/properties/{prop.Id}", prop);
        }).RequireAuthorization();

        app.MapGet("/api/properties/{id}", async (int id, ApplicationDbContext db) =>
        {
            var prop = await db.Properties.Include(p => p.Images).SingleOrDefaultAsync(p => p.Id == id);
            if (prop is null) return Results.NotFound();

            prop.Images = prop.Images.OrderBy(i => i.Order).ToList();
            return Results.Ok(prop);
        });

        app.MapPut("/api/properties/{id}", async (int id, PropertyUpdateDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

            var prop = await db.Properties.FindAsync(id);
            if (prop == null) return Results.NotFound();

            prop.Title = dto.Title;
            prop.Description = dto.Description;
            prop.Price = dto.Price;
            prop.Bedrooms = dto.Bedrooms;
            prop.Bathrooms = dto.Bathrooms;
            prop.GarageSpaces = dto.GarageSpaces;
            prop.Area = dto.Area;
            prop.City = dto.City;
            prop.Neighborhood = dto.Neighborhood;
            prop.Active = dto.Active;

            await db.SaveChangesAsync();
            return Results.Ok(prop);
        }).RequireAuthorization();

        app.MapDelete("/api/properties/{id}", async (int id, ApplicationDbContext db) =>
        {
            var prop = await db.Properties.FindAsync(id);
            if (prop == null) return Results.NotFound();
            db.Properties.Remove(prop);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();

        app.MapPost("/api/properties/{id}/activate", async (int id, ApplicationDbContext db) =>
        {
            var prop = await db.Properties.FindAsync(id);
            if (prop == null) return Results.NotFound();
            prop.Active = true;
            await db.SaveChangesAsync();
            return Results.Ok(prop);
        }).RequireAuthorization();

        app.MapPost("/api/properties/{id}/deactivate", async (int id, ApplicationDbContext db) =>
        {
            var prop = await db.Properties.FindAsync(id);
            if (prop == null) return Results.NotFound();
            prop.Active = false;
            await db.SaveChangesAsync();
            return Results.Ok(prop);
        }).RequireAuthorization();

        app.MapPost("/api/properties/{id}/images", async (int id, IFormFile file, ApplicationDbContext db) =>
        {
            var prop = await db.Properties.FindAsync(id);
            if (prop == null) return Results.NotFound();
            if (file == null || file.Length == 0) return Results.BadRequest(new { error = "Arquivo inválido" });

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadPath, fileName);

            await using (var stream = File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var img = new PropertyImage { PropertyId = id, FileName = fileName };
            db.PropertyImages.Add(img);
            await db.SaveChangesAsync();

            var url = $"/uploads/{fileName}";
            return Results.Created(url, new { img.Id, img.FileName, url });
        }).RequireAuthorization().DisableAntiforgery();

        app.MapDelete("/api/properties/{id}/images/{imageId}", async (int id, int imageId, ApplicationDbContext db) =>
        {
            var img = await db.PropertyImages.FindAsync(imageId);
            if (img == null || img.PropertyId != id) return Results.NotFound();

            var filePath = Path.Combine(uploadPath, img.FileName);
            if (File.Exists(filePath)) File.Delete(filePath);

            db.PropertyImages.Remove(img);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();

        app.MapPut("/api/properties/{id}/images/{imageId}/main", async (int id, int imageId, ApplicationDbContext db) =>
        {
            var images = await db.PropertyImages.Where(i => i.PropertyId == id).ToListAsync();
            var target = images.SingleOrDefault(i => i.Id == imageId);
            if (target == null) return Results.NotFound();

            foreach (var img in images)
            {
                img.IsMain = img.Id == imageId;
            }

            await db.SaveChangesAsync();
            return Results.Ok(target);
        }).RequireAuthorization();

        app.MapPut("/api/properties/{id}/images/order", async (int id, ImageOrderDto dto, ApplicationDbContext db) =>
        {
            var images = await db.PropertyImages.Where(i => i.PropertyId == id).ToListAsync();

            foreach (var (imageId, index) in dto.ImageIds.Select((imageId, index) => (imageId, index)))
            {
                var img = images.SingleOrDefault(i => i.Id == imageId);
                if (img != null) img.Order = index;
            }

            await db.SaveChangesAsync();
            return Results.Ok(images.OrderBy(i => i.Order));
        }).RequireAuthorization();
    }
}