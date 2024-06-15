import { Meal } from "./meal.model";

export interface MealOffer{
    id?: number;
    type: MealType;
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
    PREGNANT = "PORODILJE",
    OPERATED_PATIENT = "OPERISANI",
    MILD_PATIENT = "TESKI PACIJENTI",
    STANDARD_PATIENT = "STANDARDNI",
    DOCTOR = "DOKTORI",
    CHILDREN_2_4 = "DECA(2-4)",
    CHILDREN_4_14 = "DECA(4-14)",
    DIABETIC = "DIJABETICARI",
    ALL = "SVI"
}
/*
export const ConsumerTypeLabels = {
    [ConsumerType.PREGNANT]: "PORODILJE",
    [ConsumerType.OPERATED_PATIENT]: "OPERISANI",
    [ConsumerType.MILD_PATIENT]: "TESKI PACIJENTI",
    [ConsumerType.STANDARD_PATIENT]: "STANDARDNI",
    [ConsumerType.DOCTOR]: "DOKTORI",
    [ConsumerType.CHILDREN_2_4]: "DECA(2-4)",
    [ConsumerType.CHILDREN_4_14]: "DECA(4-14)",
    [ConsumerType.DIABETIC]: "DIJABETICARI",
    [ConsumerType.ALL]: "SVI"
};*/