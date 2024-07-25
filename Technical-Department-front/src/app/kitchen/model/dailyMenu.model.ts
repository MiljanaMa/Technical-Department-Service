import { MealOffer } from "./meal-offer.model";

export interface DailyMenu {
    id?: number;
    dayOfWeek: DayOfWeek;
    menu: MealOffer[];
}

export enum DayOfWeek {
    MONDAY = 0,
    TUESDAY = 1,
    WEDNESDAY = 2,
    THURSDAY = 3,
    FRIDAY = 4,
    SATURDAY = 5,
    SUNDAY = 6
}

export const DayOfWeekLabels = {
    [DayOfWeek.MONDAY]: "PONEDELJAK",
    [DayOfWeek.TUESDAY]: "UTORAK",
    [DayOfWeek.WEDNESDAY]: "SREDA",
    [DayOfWeek.THURSDAY]: "CETVRTAK",
    [DayOfWeek.FRIDAY]: "PETAK",
    [DayOfWeek.SATURDAY]: "SUBOTA",
    [DayOfWeek.SUNDAY]: "NEDELJA"
};

