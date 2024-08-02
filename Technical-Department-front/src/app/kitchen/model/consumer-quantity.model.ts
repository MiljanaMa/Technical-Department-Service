import { ConsumerType, MealType } from "./meal-offer.model";

export interface ConsumerQuantity {
    consumerType: ConsumerType;
    mealType: MealType;
    quantity: number;
}