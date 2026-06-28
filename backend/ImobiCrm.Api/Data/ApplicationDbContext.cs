using ImobiCrm.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImobiCrm.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Property>(b =>
        {
            b.HasKey(p => p.Id);
            b.HasMany(p => p.Images).WithOne(i => i.Property).HasForeignKey(i => i.PropertyId);
        });

        modelBuilder.Entity<PropertyImage>(b =>
        {
            b.HasKey(i => i.Id);
        });

        modelBuilder.Entity<Lead>(b =>
        {
            b.HasKey(l => l.Id);
            b.Property(l => l.Status).HasDefaultValue("Novo");
        });
    }
}
