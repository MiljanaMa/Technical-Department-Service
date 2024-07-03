using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Technical_Department.Kitchen.Core.Domain;

namespace Technical_Department.Kitchen.Infrastructure.Database;

public class KitchenContext: DbContext
{
    public KitchenContext(DbContextOptions<KitchenContext> options) : base(options)
    {
    }

    public DbSet<Ingredient> Ingredients { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("kitchen");

        ConfigureTour(modelBuilder);
    }

    private static void ConfigureTour(ModelBuilder modelBuilder)
    {
        /*modelBuilder.Entity<Keypoint>()
            .HasOne(k => k.Tour)
            .WithMany(t => t.Keypoints);*/
    }
}