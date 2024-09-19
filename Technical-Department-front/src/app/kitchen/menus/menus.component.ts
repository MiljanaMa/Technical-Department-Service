import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { KitchenService } from '../kitchen.service';
import { WeeklyMenu, WeeklyMenuStatus, WeeklyMenuStatusLabels } from '../model/weekly-menu.model';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-new-menu',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  currentWeeklyMenu: WeeklyMenu | undefined;
  newWeeklyMenu: WeeklyMenu | undefined;
  selectedWeeklyMenu: WeeklyMenu | undefined;
  selectedDailyMenu: DailyMenu | undefined;
  selectedMenuTabIndex: number | null = 0;
  selectedDayTabIndex: number | null = 0;
  mealOffers: MealOffer[] = [];
  dataSource: any[] = [];
  
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
  })).filter(weeklyMenuStatus => ![WeeklyMenuStatus.DRAFT].includes(weeklyMenuStatus.value));

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
    this.selectedMenuTabIndex = this.weeklyMenuStatuses[event.index].value;
    if(this.selectedMenuTabIndex == WeeklyMenuStatus.CURRENT){
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
    this.selectedDayTabIndex = this.daysOfWeek[event.index].value;
    console.log("Selected day of week tab: " + this.selectedDayTabIndex);
    if (this.selectedWeeklyMenu && this.selectedWeeklyMenu.menu) {
      for (const dailyMenu of this.selectedWeeklyMenu.menu) {
        if (dailyMenu.dayOfWeek === this.selectedDayTabIndex) {
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
    const date = fromDate.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return date;
  }

  showTabularDefaultMenu(): void {
    const menus: DailyMenu[] = [];
    this.newWeeklyMenu = {
      from: this.formatDate(this.getNextMonday()),
      to: this.formatDate(this.getNextMondayPlusWeek()),
      menu: menus,
      status: WeeklyMenuStatus.DRAFT
    };
    this.service.createDraftFromDefaultMenu(-1).subscribe({
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
 
  async exportToPDF(): Promise<void> {
    if (!this.selectedWeeklyMenu) {
      console.error('No weekly menu selected for export.');
      return;
    }
  
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
  
    const pageWidth = 210;
    const pageHeight = 297;
    const padding = 10;
    let position = padding;
  
    const addImageToPDF = (canvas: HTMLCanvasElement, posY: number) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - padding * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      if (posY + imgHeight > pageHeight) {
        pdf.addPage();
        posY = padding;
      }
  
      pdf.addImage(imgData, 'PNG', padding, posY, imgWidth, imgHeight);
      return posY + imgHeight + padding;
    };
  
    for (let dayIndex = 0; dayIndex < this.daysOfWeek.length; dayIndex++) {
      this.selectedDayTabIndex = dayIndex;
      await this.sleep(400);
      position += 10;
      pdf.text(this.daysOfWeek[this.selectedDayTabIndex].name + " - " + this.getDayDate(this.selectedDayTabIndex || 0), 10,  position);
      position += 10;

      const content = document.getElementById('tableToExport');
      if (content) {
        const tableCanvas = await html2canvas(content);
        position = addImageToPDF(tableCanvas, position);
      }
    }

    pdf.save('jelovnik.pdf');
  }
  
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
