using ImobiCrm.Api.Data;
using ImobiCrm.Api.Models;
using ImobiCrm.Api.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000", "http://127.0.0.1:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt:Key not configured");
var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

static bool TryValidate<T>(T dto, out IDictionary<string, string[]> errors)
{
    var context = new ValidationContext(dto!);
    var results = new List<ValidationResult>();
    var isValid = Validator.TryValidateObject(dto!, context, results, true);
    errors = results
        .SelectMany(r => r.MemberNames.DefaultIfEmpty(string.Empty)
            .Select(memberName => new { memberName, message = r.ErrorMessage ?? "Inválido" }))
        .GroupBy(x => x.memberName)
        .ToDictionary(g => g.Key, g => g.Select(x => x.message).ToArray());
    return isValid;
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

var uploadPath = builder.Configuration["UploadPath"] ?? "wwwroot/uploads";
Directory.CreateDirectory(uploadPath);
app.UseStaticFiles();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

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
    if (!TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

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
    return prop is null ? Results.NotFound() : Results.Ok(prop);
});

app.MapPut("/api/properties/{id}", async (int id, PropertyUpdateDto dto, ApplicationDbContext db) =>
{
    if (!TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

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

app.MapPost("/api/auth/register", async (RegisterDto dto, ApplicationDbContext db) =>
{
    if (!TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

    if (await db.Users.AnyAsync(u => u.Email == dto.Email))
        return Results.Conflict(new { error = "Email já cadastrado" });

    var user = new User { Name = dto.Name, Email = dto.Email };
    var hasher = new PasswordHasher<User>();
    user.PasswordHash = hasher.HashPassword(user, dto.Password);

    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", new { user.Id, user.Name, user.Email });
});

app.MapPost("/api/auth/login", async (LoginDto dto, ApplicationDbContext db) =>
{
    if (!TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

    var user = await db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
    if (user == null) return Results.Unauthorized();

    var hasher = new PasswordHasher<User>();
    var result = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
    if (result == PasswordVerificationResult.Failed) return Results.Unauthorized();

    var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(jwtKey);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new System.Security.Claims.ClaimsIdentity(new[] {
            new System.Security.Claims.Claim("id", user.Id.ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.Email)
        }),
        Expires = DateTime.UtcNow.AddMinutes(double.Parse(builder.Configuration["Jwt:ExpireMinutes"] ?? "120")),
        Issuer = issuer,
        Audience = audience,
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var jwt = tokenHandler.WriteToken(token);

    return Results.Ok(new { token = jwt });
});

app.MapGet("/api/auth/me", async (HttpContext ctx, ApplicationDbContext db) =>
{
    var idClaim = ctx.User.Claims.FirstOrDefault(c => c.Type == "id");
    if (idClaim == null) return Results.Unauthorized();

    if (!int.TryParse(idClaim.Value, out var userId)) return Results.Unauthorized();
    var user = await db.Users.FindAsync(userId);
    if (user == null) return Results.NotFound();
    return Results.Ok(new { user.Id, user.Name, user.Email });
}).RequireAuthorization();

app.MapPost("/api/auth/change-password", async (ChangePasswordDto dto, HttpContext ctx, ApplicationDbContext db) =>
{
    var idClaim = ctx.User.Claims.FirstOrDefault(c => c.Type == "id");
    if (idClaim == null) return Results.Unauthorized();
    if (!int.TryParse(idClaim.Value, out var userId)) return Results.Unauthorized();

    var user = await db.Users.FindAsync(userId);
    if (user == null) return Results.NotFound();

    var hasher = new PasswordHasher<User>();
    var verify = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.CurrentPassword);
    if (verify == PasswordVerificationResult.Failed) return Results.BadRequest(new { error = "Senha atual inválida" });

    user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);
    await db.SaveChangesAsync();
    return Results.Ok();
}).RequireAuthorization();

app.MapPost("/api/auth/recover", async (RecoverDto dto, ApplicationDbContext db) =>
{
    var user = await db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
    if (user == null) return Results.Ok(); // don't reveal

    var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    var pr = new PasswordResetToken { UserId = user.Id, Token = token, ExpiresAt = DateTime.UtcNow.AddHours(2) };
    db.Set<PasswordResetToken>().Add(pr);
    await db.SaveChangesAsync();

    return Results.Ok(new { token });
});

app.MapPost("/api/auth/reset", async (ResetDto dto, ApplicationDbContext db) =>
{
    var pr = await db.Set<PasswordResetToken>().SingleOrDefaultAsync(t => t.Token == dto.Token && t.ExpiresAt > DateTime.UtcNow);
    if (pr == null) return Results.BadRequest(new { error = "Token inválido ou expirado" });

    var user = await db.Users.FindAsync(pr.UserId);
    if (user == null) return Results.BadRequest(new { error = "Usuário não encontrado" });

    var hasher = new PasswordHasher<User>();
    user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);
    db.Set<PasswordResetToken>().Remove(pr);
    await db.SaveChangesAsync();

    return Results.Ok();
});

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

var allowedStatuses = new[] { "Novo", "Contatado", "Visita Agendada", "Fechado", "Perdido" };

app.MapPost("/api/leads", async (LeadCreateDto dto, ApplicationDbContext db) =>
{
    if (!TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

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
    await db.Leads.OrderByDescending(l => l.Id).ToListAsync()).RequireAuthorization();

app.MapGet("/api/leads/{id}", async (int id, ApplicationDbContext db) =>
{
    var lead = await db.Leads.Include(l => l.Property).SingleOrDefaultAsync(l => l.Id == id);
    return lead == null ? Results.NotFound() : Results.Ok(lead);
}).RequireAuthorization();

app.MapPut("/api/leads/{id}/status", async (int id, LeadStatusUpdateDto dto, ApplicationDbContext db) =>
{
    if (!allowedStatuses.Contains(dto.Status)) return Results.BadRequest(new { error = "Status inválido" });
    var lead = await db.Leads.FindAsync(id);
    if (lead == null) return Results.NotFound();
    lead.Status = dto.Status;
    await db.SaveChangesAsync();
    return Results.Ok(lead);
}).RequireAuthorization();

app.MapPut("/api/leads/{id}", async (int id, LeadCreateDto dto, ApplicationDbContext db) =>
{
    if (!TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

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


app.Run();
