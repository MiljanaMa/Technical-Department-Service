import { MealOffer } from "./meal-offer.model";

export interface DailyMenu {
    id?: number;
    dayOfWeek: DayOfWeek;
    menu: MealOffer[];
}

export enum DayOfWeek{
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}

