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
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<ClientEmail> ClientEmails => Set<ClientEmail>();
    public DbSet<ClientProperty> ClientProperties => Set<ClientProperty>();
    public DbSet<ClientServiceHistory> ClientServiceHistories => Set<ClientServiceHistory>();
    public DbSet<ClientPhone> ClientPhones => Set<ClientPhone>();
    public DbSet<ClientAddress> ClientAddresses => Set<ClientAddress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(b =>
        {
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.Email).IsUnique();
        });

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

        modelBuilder.Entity<Client>(b =>
        {
            b.HasKey(c => c.Id);
            b.HasMany(c => c.Phones).WithOne(p => p.Client).HasForeignKey(p => p.ClientId);
            b.HasMany(c => c.Emails).WithOne(e => e.Client).HasForeignKey(e => e.ClientId);
            b.HasMany(c => c.ServiceHistories).WithOne(sh => sh.Client).HasForeignKey(sh => sh.ClientId);
            b.HasMany(c => c.Properties).WithOne(cp => cp.Client).HasForeignKey(cp => cp.ClientId);
            b.HasMany(c => c.Addresses).WithOne(ca => ca.Client).HasForeignKey(ca => ca.ClientId);
        });

        modelBuilder.Entity<ClientProperty>(b =>
        {
            b.HasKey(cp => cp.Id);
            b.HasOne(cp => cp.Property).WithMany().HasForeignKey(cp => cp.PropertyId);
        });

        modelBuilder.Entity<ClientServiceHistory>(b =>
        {
            b.HasKey(csh => csh.Id);
            b.HasOne(csh => csh.User).WithMany().HasForeignKey(csh => csh.UserId);
        });

        modelBuilder.Entity<ClientPhone>(b =>
        {
            b.HasKey(cp => cp.Id);
        });

        modelBuilder.Entity<ClientAddress>(b =>
        {
            b.HasKey(a => a.Id);
        });
    }
}
