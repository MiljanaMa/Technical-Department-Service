import { DailyMenu } from "./daily-menu.model";

export interface WeeklyMenu {
    id?: number;
    from: string;
    to: string;
    menu?: DailyMenu[];
    status: WeeklyMenuStatus;
}

export enum WeeklyMenuStatus {
    PREVIOUS = 0,
    CURRENT = 1,
    DRAFT = 2,
    NEW = 3,
    DEFAULT = 4
}

export const WeeklyMenuStatusLabels = {
    [WeeklyMenuStatus.PREVIOUS]: "PRETHODNI",
    [WeeklyMenuStatus.CURRENT]: "TRENUTNI",
    [WeeklyMenuStatus.DRAFT]: "U IZRADI",
    [WeeklyMenuStatus.NEW]: "NOVI",
    [WeeklyMenuStatus.DEFAULT]: "DIFOLTNI",
};

