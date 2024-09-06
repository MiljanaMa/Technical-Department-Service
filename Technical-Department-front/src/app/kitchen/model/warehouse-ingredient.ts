import { Ingredient } from "./ingredient.model";

export interface WarehouseIngredient{
    name: string;
    warehouseUnitShortName: string;
    scale: number;
    unitShortName: string;
    isConfirmed: boolean;
    ingredient?: Ingredient;
}