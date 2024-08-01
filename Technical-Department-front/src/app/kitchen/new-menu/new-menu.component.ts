import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KitchenService } from '../kitchen.service';
import { WeeklyMenu, WeeklyMenuStatus } from '../model/weekly-menu.model';
import { DailyMenu } from '../model/daily-menu.model';

@Component({
  selector: 'app-new-menu',
  templateUrl: './new-menu.component.html',
  styleUrls: ['./new-menu.component.css']
})
export class NewMenuComponent {

  weeklyMenu: WeeklyMenu | undefined;

constructor(private router: Router, private service: KitchenService){}


  showTabularView(): void {
    const menus: DailyMenu[] = [];
    this.weeklyMenu = {
      from: this.formatDate(this.getNextMonday()),
      to: this.formatDate(this.getNextMondayPlusWeek()),
      menu: menus,
      status: WeeklyMenuStatus.DRAFT
    };
    this.service.createDraftFromDefaultMenu(this.weeklyMenu).subscribe({
      next: (result: WeeklyMenu) => {
        console.log("Weekly menu:", result);
        this.router.navigate(['/tabular-menu/draft']);
      },
      error: (error: any) => {
        console.error('Error saving weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
     
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getNextMonday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysUntilNextMonday = (7 - dayOfWeek + 1) % 7 || 7; 
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday;
  }

  getNextMondayPlusWeek(): Date {
    const nextMonday = this.getNextMonday();
    const nextMondayPlusWeek = new Date(nextMonday);
    nextMondayPlusWeek.setDate(nextMondayPlusWeek.getDate() + 7);
    return nextMondayPlusWeek;
  }
}
