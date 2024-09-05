using BuildingBlocks.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class KitchenWarehouseIngredient: Entity
    {
        public long IngredientId { get; init; }
        public Ingredient Ingredient { get; init; }
        public double Quantity { get; init; }
        public double MeasurementUnitScale { get; init; }

    }
}
