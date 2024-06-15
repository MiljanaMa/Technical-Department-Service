import { Meal } from "./meal.model";

export interface MealOffer{
    id?: 1;
    type: MealOffer;
    consumerType: ConsumerType;
    mealId: number;
    meal: Meal;
}

export enum MealType {
    BREAKFAST = "DORUCAK",
    LUNCH  = "RUCAK",
    DINNER  = "VECERA",
    MORNING_SNACK  = "JUTARNJA UZINA",
    DINNER_SNACK  = "POPODNEVNA UZINA",
    LUNCH_SALAD  = "SALATA UZ RUCAK",
    DINNER_SALAD  = "SALATA UZ VECERU"
}

export enum ConsumerType{
    PREGNANT,
    OPERATED_PATIENT,
    MILD_PATIENT,
    STANDARD_PATIENT,
    DOCTOR,
    CHILDREN_2_4,
    CHILDREN_4_14,
    DIABETIC,
    ALL
}