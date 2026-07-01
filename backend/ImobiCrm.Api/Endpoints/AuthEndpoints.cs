using System.Text;
using ImobiCrm.Api.Data;
using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ImobiCrm.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app, IConfiguration configuration)
    {
        var jwtKey = configuration["Jwt:Key"] ?? throw new Exception("Jwt:Key not configured");
        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];
    
        app.MapPost("/api/auth/register", async (RegisterDto dto, ApplicationDbContext db) =>
        {
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

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
            if (!ValidationHelpers.TryValidate(dto, out var errors)) return Results.ValidationProblem(errors);

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
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(configuration["Jwt:ExpireMinutes"] ?? "120")),
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
    }
}

        