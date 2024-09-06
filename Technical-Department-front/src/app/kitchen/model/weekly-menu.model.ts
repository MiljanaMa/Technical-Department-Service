import { DailyMenu } from "./daily-menu.model";

export interface WeeklyMenu {
    id?: number;
    from: string;
    to: string;
    menu?: DailyMenu[];
    status: WeeklyMenuStatus;
}

export enum WeeklyMenuStatus {
    CURRENT = 0,
    DRAFT = 1,
    NEW = 2,
    DEFAULT = 3
}

export const WeeklyMenuStatusLabels = {
    [WeeklyMenuStatus.CURRENT]: "TRENUTNI",
    [WeeklyMenuStatus.DRAFT]: "U IZRADI",
    [WeeklyMenuStatus.NEW]: "NOVI",
    [WeeklyMenuStatus.DEFAULT]: "DIFOLTNI"
};

