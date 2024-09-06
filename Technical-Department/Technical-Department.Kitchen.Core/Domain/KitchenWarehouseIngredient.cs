using BuildingBlocks.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class KitchenWarehouseIngredient: Entity
    {
        public long IngredientId { get; init; }
        public Ingredient Ingredient { get; private set; }
        public string WarehouseLabel { get; init; }
        public double Quantity { get; private set; }
        public double MeasurementUnitScale { get; init; }
        public void Create(Ingredient ingredient)
        {
            this.Ingredient = ingredient;
            this.Quantity = Quantity;
        }
        public void UpdateQuantity(double deliveryNoteQuantity, double requirementQuantity)
        {
            double newQuantity;
            if (this.MeasurementUnitScale != 0)
            newQuantity = deliveryNoteQuantity * this.MeasurementUnitScale - requirementQuantity;
            else
                newQuantity = deliveryNoteQuantity - requirementQuantity;
            this.Quantity += Math.Max(newQuantity, 0);
        }

    }
}
