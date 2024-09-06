import { Ingredient } from "./ingredient.model";
import { WarehouseIngredient } from "./warehouse-ingredient";

export interface KitchenWarehouseIngredient{
    measurementUnitScale: number;
    quantity: number;
    warehouseLabel: string;
    ingredientId: number;
    ingredient: Ingredient;
}