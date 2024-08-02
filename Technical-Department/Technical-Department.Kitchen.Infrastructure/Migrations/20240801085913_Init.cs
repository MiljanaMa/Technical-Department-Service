using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Technical_Department.Kitchen.Core.Domain;

#nullable disable

namespace Technical_Department.Kitchen.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "kitchen");

            migrationBuilder.CreateTable(
                name: "Meals",
                schema: "kitchen",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Calories = table.Column<double>(type: "double precision", nullable: false),
                    StandardizationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ingredients = table.Column<ICollection<IngredientQuantity>>(type: "jsonb", nullable: false),
                    DishTypes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MeasurementUnits",
                schema: "kitchen",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ShortName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeasurementUnits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeeklyMenus",
                schema: "kitchen",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    From = table.Column<DateOnly>(type: "date", nullable: false),
                    To = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyMenus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ingredients",
                schema: "kitchen",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Calories = table.Column<double>(type: "double precision", nullable: false),
                    Proteins = table.Column<double>(type: "double precision", nullable: false),
                    Carbohydrates = table.Column<double>(type: "double precision", nullable: false),
                    Fats = table.Column<double>(type: "double precision", nullable: false),
                    Sugar = table.Column<double>(type: "double precision", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    UnitId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ingredients_MeasurementUnits_UnitId",
                        column: x => x.UnitId,
                        principalSchema: "kitchen",
                        principalTable: "MeasurementUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailyMenus",
                schema: "kitchen",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    Menu = table.Column<ICollection<MealOffer>>(type: "jsonb", nullable: false),
                    WeeklyMenuId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyMenus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyMenus_WeeklyMenus_WeeklyMenuId",
                        column: x => x.WeeklyMenuId,
                        principalSchema: "kitchen",
                        principalTable: "WeeklyMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenus_WeeklyMenuId",
                schema: "kitchen",
                table: "DailyMenus",
                column: "WeeklyMenuId");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_UnitId",
                schema: "kitchen",
                table: "Ingredients",
                column: "UnitId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyMenus",
                schema: "kitchen");

            migrationBuilder.DropTable(
                name: "Ingredients",
                schema: "kitchen");

            migrationBuilder.DropTable(
                name: "Meals",
                schema: "kitchen");

            migrationBuilder.DropTable(
                name: "WeeklyMenus",
                schema: "kitchen");

            migrationBuilder.DropTable(
                name: "MeasurementUnits",
                schema: "kitchen");
        }
    }
}
