import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KitchenService } from '../kitchen.service';
import { WeeklyMenu, WeeklyMenuStatus, WeeklyMenuStatusLabels } from '../model/weekly-menu.model';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';

@Component({
  selector: 'app-new-menu',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  currentWeeklyMenu: WeeklyMenu | undefined;
  newWeeklyMenu: WeeklyMenu | undefined;
  selectedWeeklyMenu: WeeklyMenu | undefined;
  selectedMenuTabIndex: number | null = 0;
  mealOffers: MealOffer[] = [];
  dataSource: any[] = [];

  selectedDailyMenu: DailyMenu | undefined;
  daysOfWeek = Object.keys(DayOfWeek)
    .filter(key => !isNaN(Number(DayOfWeek[key as keyof typeof DayOfWeek])))
    .map(key => ({
      name: DayOfWeekLabels[DayOfWeek[key as keyof typeof DayOfWeek] as keyof typeof DayOfWeekLabels],
      value: DayOfWeek[key as keyof typeof DayOfWeek] 
    }));

  consumerTypes = Object.keys(ConsumerType)
    .filter(key => !isNaN(Number(ConsumerType[key as keyof typeof ConsumerType])))
    .map(key => ({
      name: ConsumerTypeLabels[ConsumerType[key as keyof typeof ConsumerType] as keyof typeof ConsumerTypeLabels],
      value: ConsumerType[key as keyof typeof ConsumerType]
    }));

  mealTypes = Object.keys(MealType)
    .filter(key => !isNaN(Number(MealType[key as keyof typeof MealType])))
    .map(key => ({
      name: MealTypeLabels[MealType[key as keyof typeof MealType] as keyof typeof MealTypeLabels],
      value: MealType[key as keyof typeof MealType]
    }));

  weeklyMenuStatuses = Object.keys(WeeklyMenuStatus)
  .filter(key => !isNaN(Number(WeeklyMenuStatus[key as keyof typeof WeeklyMenuStatus])))
  .map(key => ({
    name: WeeklyMenuStatusLabels[WeeklyMenuStatus[key as keyof typeof WeeklyMenuStatus] as keyof typeof WeeklyMenuStatusLabels],
    value: WeeklyMenuStatus[key as keyof typeof WeeklyMenuStatus]
  })).filter(weeklyMenuStatus => ![WeeklyMenuStatus.PREVIOUS, WeeklyMenuStatus.DRAFT, WeeklyMenuStatus.DEFAULT].includes(weeklyMenuStatus.value));

  displayedColumns: string[] = ['consumerType', ...this.mealTypes.map(mealType => mealType.value.toString())];

  constructor(private router: Router, private service: KitchenService){}

  ngOnInit(): void {
    this.getCurrentMenu();
    this.getNewMenu();
  }

  getCurrentMenu(): void {
    this.service.getMenu('CURRENT').subscribe({
      next: (result: WeeklyMenu) => {
        this.currentWeeklyMenu = result;
        this.selectedWeeklyMenu = this.currentWeeklyMenu;
             
        if (this.currentWeeklyMenu && this.currentWeeklyMenu.menu && this.currentWeeklyMenu.menu.length > 0) {
          this.selectedDailyMenu = this.currentWeeklyMenu.menu.find(menu => menu.dayOfWeek === DayOfWeek.MONDAY);      
          this.updateDataSource();
        }
        console.log("Weekly menu:", result);
    },
      error: (error) => {
        console.error('Error fetching weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
  }

  getNewMenu(): void {
    this.service.getMenu('NEW').subscribe({
      next: (result: WeeklyMenu) => {
        this.newWeeklyMenu = result;    
    },
      error: (error) => {
        console.error('Error fetching weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
  }

  updateDataSource(): void {
    this.dataSource = this.consumerTypes.map(consumerType => {
      const row: any = { consumerType: consumerType.name };

      if (this.selectedDailyMenu) {
        this.mealOffers = this.selectedDailyMenu!.menu;

        this.mealTypes.forEach(mealType => {
          const offer = this.mealOffers.find(offer => offer.consumerType === consumerType.value && offer.type === mealType.value);
          row[mealType.value.toString()] = offer ? offer.mealName : '';
        });
      }
      return row;
    });
  }

  onSelectedMenuStatusTabChange(event: any): void {
    const selectedWeeklyMenuStatus = this.weeklyMenuStatuses[event.index].value;
    if(selectedWeeklyMenuStatus == WeeklyMenuStatus.CURRENT){
      this.selectedWeeklyMenu = this.currentWeeklyMenu;
    }else{
      this.selectedWeeklyMenu = this.newWeeklyMenu;
    }
    if (this.selectedWeeklyMenu && this.selectedWeeklyMenu.menu && this.selectedWeeklyMenu.menu.length > 0) {
      this.selectedDailyMenu = this.selectedWeeklyMenu.menu.find(menu => menu.dayOfWeek === DayOfWeek.MONDAY);      
      this.updateDataSource();
    }
    console.log("SELEKTOVANI MENI:")
    console.log( this.selectedWeeklyMenu)
    this.selectedMenuTabIndex = event.index;
  } 

  onSelectedDayTabChange(event: any): void {
    const selectedDayOfWeek = this.daysOfWeek[event.index].value;
    console.log("Selected day of week tab: " + selectedDayOfWeek);
    if (this.selectedWeeklyMenu && this.selectedWeeklyMenu.menu) {
      for (const dailyMenu of this.selectedWeeklyMenu.menu) {
        if (dailyMenu.dayOfWeek === selectedDayOfWeek) {
          this.selectedDailyMenu = dailyMenu;
          this.updateDataSource();
          break;
        }
      }
    }
  }

  getMealTypeClass(mealType: MealType): string {
    switch (mealType) {
      case MealType.BREAKFAST:
      case MealType.LUNCH:
      case MealType.DINNER:
        return 'main-meal';
      case MealType.MORNING_SNACK:      
      case MealType.DINNER_SNACK:
        return 'snack';
      case MealType.LUNCH_SALAD:
      case MealType.DINNER_SALAD:
        return 'salad';
      default:
        return '';
    }
  }

  getDayDate(dayIndex: number): string {
    if (!this.selectedWeeklyMenu?.from) return '';

    const fromDate = new Date(this.selectedWeeklyMenu.from);
    fromDate.setDate(fromDate.getDate() + dayIndex);
    return this.formatToDayMonthYear(fromDate);
  }

  formatToDayMonthYear(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }


  showTabularDefaultMenu(): void {
    const menus: DailyMenu[] = [];
    this.newWeeklyMenu = {
      from: this.formatDate(this.getNextMonday()),
      to: this.formatDate(this.getNextMondayPlusWeek()),
      menu: menus,
      status: WeeklyMenuStatus.DRAFT
    };
    this.service.createDraftFromDefaultMenu(this.newWeeklyMenu).subscribe({
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

  changeNewMenu(): void {
    this.router.navigate(['/tabular-menu/new']);
  }

}
