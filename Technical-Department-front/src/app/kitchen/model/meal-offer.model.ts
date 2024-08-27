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
    DOCTOR = 0,
    PREGNANT = 1,
    DIABETIC = 2,
    CHILDREN_2_4 = 3,
    CHILDREN_4_14 = 4,
    MILD_PATIENT = 5,
    OPERATED_PATIENT = 6
} 

export const ConsumerTypeLabels = {
    [ConsumerType.DOCTOR]: "DOKTORI",
    [ConsumerType.PREGNANT]: "PORODILJE",
    [ConsumerType.DIABETIC]: "DIJABETICARI",   
    [ConsumerType.CHILDREN_2_4]: "DECA(2-4)",
    [ConsumerType.CHILDREN_4_14]: "DECA(4-14)",
    [ConsumerType.MILD_PATIENT]: "BLAGI PACIJENTI",
    [ConsumerType.OPERATED_PATIENT]: "OPERISANI PACIJENTI"
}