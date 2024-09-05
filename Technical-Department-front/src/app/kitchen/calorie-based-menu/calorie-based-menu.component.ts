import { Component, OnInit } from '@angular/core';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { KitchenService } from '../kitchen.service';
import { WeeklyMenu } from '../model/weekly-menu.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-calorie-based-menu',
  templateUrl: './calorie-based-menu.component.html',
  styleUrls: ['./calorie-based-menu.component.css']
})
export class CalorieBasedMenuComponent implements OnInit {

  weeklyMenu: WeeklyMenu | undefined;

  daysOfWeek = Object.keys(DayOfWeek)
    .filter(key => !isNaN(Number(DayOfWeek[key as keyof typeof DayOfWeek])))
    .map(key => ({
      name: DayOfWeekLabels[DayOfWeek[key as keyof typeof DayOfWeek] as keyof typeof DayOfWeekLabels],
      value: DayOfWeek[key as keyof typeof DayOfWeek]
    }));

  mealTypes = Object.keys(MealType)
    .filter(key => !isNaN(Number(MealType[key as keyof typeof MealType])))
    .map(key => ({
      name: MealTypeLabels[MealType[key as keyof typeof MealType] as keyof typeof MealTypeLabels],
      value: MealType[key as keyof typeof MealType]
    }));

  dataSource: any[] = [];
  displayedColumns: string[] = ['mealType', ...this.daysOfWeek.map(day => day.value.toString())];

  constructor(private service: KitchenService) { }

  ngOnInit(): void {
   
  }

  createCustomMenu(): void {
    this.service.createCustomMenu(1540).subscribe({
      next: (result: WeeklyMenu) => {
        this.weeklyMenu = result;
        this.processMenu(result.menu);
      },
      error: (error) => {
        console.error('Error fetching weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
  }

  processMenu(dailyMenus: DailyMenu[] | undefined): void {
    if (!dailyMenus) return;
  
    this.dataSource = this.mealTypes.map(mealType => {
      let row: any = { mealType: mealType.name };
      this.daysOfWeek.forEach(day => {
        const menuForDay = dailyMenus.find(menu => menu.dayOfWeek === day.value);
        const mealOffer = menuForDay?.menu.find((offer: MealOffer) => offer.type === mealType.value);
        row[day.value.toString()] = mealOffer ? mealOffer.mealName : '-';
      });
      return row;
    });
  }

  async exportToPDF(): Promise<void> {
    const editButtons = document.querySelectorAll('.hide-on-export');
    editButtons.forEach(button => {
      (button as HTMLElement).classList.add('hide-in-pdf');
    });
  
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
  
    const content = document.getElementById('tableToExport');
    if (!content) return;
  
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; 
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;
  
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.save('prilagodjeni-jelovnik.pdf');
  
    editButtons.forEach(button => {
      (button as HTMLElement).classList.remove('hide-in-pdf');
    });
  }
  
  
}
