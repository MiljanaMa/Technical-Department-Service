import { DailyMenu } from "./daily-menu.model";

export interface WeeklyMenu {
    id?: number;
    from: string;
    to: string;
    menu?: DailyMenu[];
}
