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
    public DbSet<MeasurementUnit> MeasurementUnits { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<Meal> Meals { get; set; }
    public DbSet<DailyMenu> DailyMenus { get; set; }
    public DbSet<WeeklyMenu> WeeklyMenus { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("kitchen");
        modelBuilder.Entity<IngredientQuantity>().HasNoKey();

        ConfigureKitchen(modelBuilder);
    }

    private static void ConfigureKitchen(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ingredient>()
            .HasOne(k => k.Unit)
            .WithMany()
            .HasForeignKey(k => k.UnitId);

        modelBuilder.Entity<Meal>().Property(item => item.Ingredients).HasColumnType("jsonb");

        modelBuilder.Entity<Meal>()
            .Property(m => m.DishTypes)
            .HasColumnName("DishTypes");

        modelBuilder.Entity<DailyMenu>().Property(item => item.Menu).HasColumnType("jsonb");
        modelBuilder.Entity<DailyMenu>()
           .HasOne(dm => dm.WeeklyMenu)
           .WithMany(wm => wm.Menu)
           .HasForeignKey(dm => dm.WeeklyMenuId);
    }
}