export interface Meal{
    id?: number;
    name: string;
    types: DishType[];
}

export enum DishType
{
    BREAKFAST,
    LUNCH,
    DINNER,
    SALAD,
    SNACK
}