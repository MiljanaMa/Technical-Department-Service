import { Meal } from "./meal.model";

export interface MealOffer{
    id?: number;
    type: MealType;
    consumerType: ConsumerType;
    mealId: number;
    mealName: string;
    consumerQuantity: number; //remove ? later
    dailyMenuId?: number; // remove ?
}

export enum MealType {
    BREAKFAST = 0,
    MORNING_SNACK  = 1,
    LUNCH  = 2,
    LUNCH_SALAD  = 3,
    DINNER_SNACK  = 4,
    DINNER  = 5,         
    DINNER_SALAD  = 6
}

export const MealTypeLabels = {
    [MealType.BREAKFAST]: "DORUCAK",
    [MealType.MORNING_SNACK]: "JUTARNJA UZINA",
    [MealType.LUNCH]: "RUCAK",
    [MealType.LUNCH_SALAD]: "SALATA UZ RUCAK",
    [MealType.DINNER_SNACK]: "POPODNEVNA UZINA",
    [MealType.DINNER]: "VECERA",
    [MealType.DINNER_SALAD]: "SALATA UZ VECERU"
};

export enum ConsumerType{
    PREGNANT = 0,
    OPERATED_PATIENT = 1,
    MILD_PATIENT = 2,
    STANDARD_PATIENT = 3,
    DOCTOR = 4,
    CHILDREN_2_4 = 5,
    CHILDREN_4_14 = 6,
    DIABETIC = 7
} 

export const ConsumerTypeLabels = {
    [ConsumerType.PREGNANT]: "PORODILJE",
    [ConsumerType.OPERATED_PATIENT]: "OPERISANI PACIJENTI",
    [ConsumerType.MILD_PATIENT]: "TESKI PACIJENTI",
    [ConsumerType.STANDARD_PATIENT]: "STANDARDNI PACIJENTI",
    [ConsumerType.DOCTOR]: "DOKTORI",
    [ConsumerType.CHILDREN_2_4]: "DECA(2-4)",
    [ConsumerType.CHILDREN_4_14]: "DECA(4-14)",
    [ConsumerType.DIABETIC]: "DIJABETICARI"
}