import { DailyMenu } from "./daily-menu.model";

export interface WeeklyMenu {
    id?: number;
    name?: string;
    from: string;
    to: string;
    menu?: DailyMenu[];
    status: WeeklyMenuStatus;
}

export enum WeeklyMenuStatus {
    CURRENT = 0,
    DRAFT = 1,
    NEW = 2,
    DEFAULT = 3,
    DRAFT_DEFAULT = 4
}

export const WeeklyMenuStatusLabels = {
    [WeeklyMenuStatus.CURRENT]: "TRENUTNI",
    [WeeklyMenuStatus.DRAFT]: "U IZRADI",
    [WeeklyMenuStatus.NEW]: "NOVI",
    [WeeklyMenuStatus.DEFAULT]: "ŠABLONSKI",
    [WeeklyMenuStatus.DRAFT_DEFAULT]: "ŠABLONSKI U IZRADI"
};

