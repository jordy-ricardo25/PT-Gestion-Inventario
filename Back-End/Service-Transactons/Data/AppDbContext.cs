using Microsoft.EntityFrameworkCore;
using Service.Transactions.Models;

namespace Service.Transactions.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(e =>
        {
            e.ToTable("transactions");

            e.HasKey(t => t.Id);
            e.Property(t => t.Id).ValueGeneratedNever();

            e.Property(t => t.ProductId).IsRequired();
            e.Property(t => t.Quantity).IsRequired();
            e.Property(t => t.UnitPrice).IsRequired();
            e.Property(t => t.TotalPrice).IsRequired();
            e.Property(t => t.Type).IsRequired();

            e.Property(t => t.UnitPrice).HasPrecision(18, 2);
            e.Property(t => t.TotalPrice).HasPrecision(18, 2);

            e.Property(t => t.Type).HasConversion<int>();

            e.HasIndex(t => t.ProductId);
        });
    }
}
