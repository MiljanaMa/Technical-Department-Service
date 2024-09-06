import { Component, OnInit } from '@angular/core';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { KitchenService } from '../kitchen.service';
import { WeeklyMenu } from '../model/weekly-menu.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calorie-based-menu',
  templateUrl: './calorie-based-menu.component.html',
  styleUrls: ['./calorie-based-menu.component.css']
})
export class CalorieBasedMenuComponent implements OnInit {

  mealsVisible: boolean = false;
  weeklyMenu: WeeklyMenu | undefined;
  breakfasts: MealOffer[] = [];
  lunches: MealOffer[] = [];
  dinners: MealOffer[] = [];
  salads: MealOffer[] = [];
  snacks: MealOffer[] = [];
  calorieInput: number = 0;

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

  constructor(private service: KitchenService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
   
  }

  createCustomMenu(): void {
    if (!this.calorieInput || this.calorieInput <= 0 || !Number.isInteger(this.calorieInput)) {
      this.showTabularView();
      return;
    }
    this.service.createCustomMenu(this.calorieInput).subscribe({
      next: (result: WeeklyMenu) => {
        this.weeklyMenu = result;
        this.processMenu(result.menu);
        this.collectMealOffers(result.menu);
      },
      error: (error) => {
        console.error('Error fetching weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
  }

  showTabularView(): void {
      this.snackBar.open('Broj kalorija mora biti pozitivan ceo broj', 'OK', {
        duration: 3000, 
        verticalPosition: 'top',
        panelClass: ['mat-warn'] 
      });
      return;

  }

  processMenu(dailyMenus: DailyMenu[] | undefined): void {
    if (!dailyMenus) return;
  
    this.dataSource = this.mealTypes.map(mealType => {
      let row: any = { mealType: mealType.name };
      this.daysOfWeek.forEach(day => {
        const menuForDay = dailyMenus.find(menu => menu.dayOfWeek === day.value);
        const mealOffer = menuForDay?.menu.find((offer: MealOffer) => offer.type === mealType.value);
        
  
        row[day.value.toString()] = mealOffer 
          ? `${mealOffer.mealName} \n (${mealOffer.calories?.toFixed(2)} kcal)`
          : '-';
      });
      return row;
    });
  
    const totalCaloriesRow: any = { mealType: 'Dnevni unos kalorija' };
    this.daysOfWeek.forEach(day => {
      const totalCalories = dailyMenus
        .filter(menu => menu.dayOfWeek === day.value) 
        .reduce((sum, menu) => {
          return sum + menu.menu.reduce((mealSum, offer: MealOffer) => mealSum + (offer.calories || 0), 0); 
        }, 0);
    
      totalCaloriesRow[day.value.toString()] = `${totalCalories.toFixed(2)} kcal`; 
    });
  
    this.dataSource.push(totalCaloriesRow);
  }

  collectMealOffers(dailyMenus: DailyMenu[] | undefined): void {
    this.mealsVisible = true;
    if (!dailyMenus) return;
  
    const mealCollections: { [key in MealType]: Set<string> } = {
      [MealType.BREAKFAST]: new Set(),
      [MealType.MORNING_SNACK]: new Set(),
      [MealType.LUNCH]: new Set(),
      [MealType.LUNCH_SALAD]: new Set(),
      [MealType.DINNER_SNACK]: new Set(),
      [MealType.DINNER]: new Set(),
      [MealType.DINNER_SALAD]: new Set(),
    };
  
    const mealOffersByType: { [key in MealType]: MealOffer[] } = {
      [MealType.BREAKFAST]: [],
      [MealType.MORNING_SNACK]: [],
      [MealType.LUNCH]: [],
      [MealType.LUNCH_SALAD]: [],
      [MealType.DINNER_SNACK]: [],
      [MealType.DINNER]: [],
      [MealType.DINNER_SALAD]: [],
    };

    dailyMenus.flatMap(dailyMenu => dailyMenu.menu).forEach(mealOffer => {
      const mealType = mealOffer.type;

      if (!mealCollections[mealType].has(mealOffer.mealName)) {
        mealCollections[mealType].add(mealOffer.mealName);  
        mealOffersByType[mealType].push(mealOffer); 
      }
    });
  

    this.breakfasts = mealOffersByType[MealType.BREAKFAST];
    this.lunches = mealOffersByType[MealType.LUNCH];
    this.dinners = mealOffersByType[MealType.DINNER];
  
    const uniqueSalads = new Set<string>();
    this.salads = [
      ...mealOffersByType[MealType.LUNCH_SALAD].filter(mealOffer => {
        if (uniqueSalads.has(mealOffer.mealName)) return false;
        uniqueSalads.add(mealOffer.mealName);
        return true;
      }),
      ...mealOffersByType[MealType.DINNER_SALAD].filter(mealOffer => {
        if (uniqueSalads.has(mealOffer.mealName)) return false;
        uniqueSalads.add(mealOffer.mealName);
        return true;
      })
    ];
  
    const uniqueSnacks = new Set<string>();
    this.snacks = [
      ...mealOffersByType[MealType.MORNING_SNACK].filter(mealOffer => {
        if (uniqueSnacks.has(mealOffer.mealName)) return false;
        uniqueSnacks.add(mealOffer.mealName);
        return true;
      }),
      ...mealOffersByType[MealType.DINNER_SNACK].filter(mealOffer => {
        if (uniqueSnacks.has(mealOffer.mealName)) return false;
        uniqueSnacks.add(mealOffer.mealName);
        return true;
      })
    ];
  }
  
  async exportToPDF(): Promise<void> {
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
  
    const content = document.getElementById('tableToExport');
    if (content) {
      const tableCanvas = await html2canvas(content);
      position = addImageToPDF(tableCanvas, position);
    }
  
    const sections = ['breakfast-section', 'lunch-section', 'dinner-section', 'salad-section', 'snack-section'];
    for (const sectionId of sections) {
      const sectionContent = document.getElementById(sectionId);
      if (sectionContent) {
        const sectionCanvas = await html2canvas(sectionContent as HTMLElement);
        position = addImageToPDF(sectionCanvas, position);
      }
    }
  
    pdf.save('prilagodjeni-jelovnik.pdf');
  }
  
}  