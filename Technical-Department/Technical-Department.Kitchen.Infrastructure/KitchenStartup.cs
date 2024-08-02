using BuildingBlocks.Core.UseCases;
using BuildingBlocks.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Technical_Department.Kitchen.API.Public;
using Technical_Department.Kitchen.Core.Domain;
using Technical_Department.Kitchen.Core.Mappers;
using Technical_Department.Kitchen.Infrastructure.Database;
using AutoMapper;
using System.Reflection;
using Technical_Department.Kitchen.Core.Domain.RepositoryInterfaces;
using Technical_Department.Kitchen.Infrastructure.Database.Repositories;
using Technical_Department.Kitchen.Core.UseCases;

namespace Technical_Department.Kitchen.Infrastructure;

public static class KitchenStartup
{
    public static IServiceCollection ConfigureKitchenModule(this IServiceCollection services)
    {
        // Registers all profiles in the assembly containing KitchenProfile
        services.AddAutoMapper(typeof(KitchenProfile).GetTypeInfo().Assembly);
        SetupCore(services);
        SetupInfrastructure(services);
        return services;
    }

    private static void SetupCore(IServiceCollection services)
    {
        services.AddScoped<IIngredientService, IngredientService>();
        services.AddScoped<IMealService, MealService>();
        services.AddScoped<IDailyMenuService, DailyMenuService>();
        services.AddScoped<IWeeklyMenuService, WeeklyMenuService>();
        services.AddScoped<IMeasurementUnitService, MeasurementUnitService>();

    }

    private static void SetupInfrastructure(IServiceCollection services)
    {
        services.AddScoped(typeof(IIngredientRepository), typeof(IngredientRepository));
        services.AddScoped(typeof(IMealRepository), typeof(MealRepository));
        services.AddScoped(typeof(IDailyMenuRepository), typeof(DailyMenuRepository));
        services.AddScoped(typeof(IWeeklyMenuRepository), typeof(WeeklyMenuRepository));
        services.AddScoped(typeof(IMeasurementUnitRepository), typeof(MeasurementUnitRepository));

        services.AddDbContext<KitchenContext>(opt =>
            opt.UseNpgsql(DbConnectionStringBuilder.Build("kitchen"),
                x => x.MigrationsHistoryTable("__EFMigrationsHistory", "kitchen")));
    }
}
