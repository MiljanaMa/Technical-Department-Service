import { DailyMenu } from "./dailyMenu.model";

export interface WeeklyMenu {
    id?: number;
    from: Date;
    to: Date;
    menu: DailyMenu[];
}
