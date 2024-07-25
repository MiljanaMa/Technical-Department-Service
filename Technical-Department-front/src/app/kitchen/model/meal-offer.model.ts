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
    MORNING_SNACK  = "JUTARNJA UZINA",
    LUNCH  = "RUCAK",
    LUNCH_SALAD  = "SALATA UZ RUCAK",
    DINNER_SNACK  = "POPODNEVNA UZINA",
    DINNER  = "VECERA",         
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
}
