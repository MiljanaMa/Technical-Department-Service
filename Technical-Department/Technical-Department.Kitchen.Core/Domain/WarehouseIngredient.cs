using BuildingBlocks.Core.Domain;

namespace Technical_Department.Kitchen.Core.Domain
{
    public class WarehouseIngredient: Entity
    {
        public long IngredientId { get; init; }
        public Ingredient Ingredient { get; private set; }
        public string WarehouseLabel { get; init; }
        public double Quantity { get; private set; }
        public double MeasurementUnitScale { get; init; }
        public void Update(Ingredient ingredient)
        {
            this.Ingredient = ingredient;
            this.Quantity = 0;
        }
        public void UpdateQuantity(double deliveryNoteQuantity, double requirementQuantity)
        {
            double newQuantity;
            if (this.MeasurementUnitScale != 0)
                newQuantity = deliveryNoteQuantity * this.MeasurementUnitScale - requirementQuantity;
            else
                newQuantity = deliveryNoteQuantity - requirementQuantity;

            newQuantity = Math.Round(newQuantity, 2);
            this.Quantity += Math.Max(newQuantity, 0);
        }

    }
}
