export interface Meal{
    id?: number;
    code: number;
    name: string;
    calories: number;
    standardizationDate: Date;
    types: DishType[];
    ingredients: IngredientQuantity[];
}
export interface IngredientQuantity{
    ingredientId: number;
    ingredientName?: string;
    unitShortName?: string;
    quantity: number;
}
export enum DishType
{
    BREAKFAST,
    LUNCH,
    DINNER,
    SALAD,
    SNACK
}