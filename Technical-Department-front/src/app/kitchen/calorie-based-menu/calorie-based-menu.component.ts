import { Component, OnInit } from '@angular/core';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { KitchenService } from '../kitchen.service';
import { WeeklyMenu } from '../model/weekly-menu.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditCalorieBasedMenuModalComponent } from '../edit-calorie-based-menu-modal/edit-calorie-based-menu-modal.component';
import { Meal } from '../model/meal.model';

@Component({
  selector: 'app-calorie-based-menu',
  templateUrl: './calorie-based-menu.component.html',
  styleUrls: ['./calorie-based-menu.component.css']
})
export class CalorieBasedMenuComponent implements OnInit {

  mealsVisible: boolean = false;
  buttonsVisible: boolean = false;
  weeklyMenu: WeeklyMenu | undefined;
  allMeals: Meal[] = [];
  breakfasts: Meal[] = [];
  lunches: Meal[] = [];
  dinners: Meal[] = [];
  salads: Meal[] = [];
  snacks: Meal[] = [];
  calorieInput: number | null = null;

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

  constructor(private service: KitchenService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

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
        this.processMenu(this.weeklyMenu.menu);
        this.collectMeals();
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

  shouldRenderEditButton(mealType: string){
    if(mealType =='Dnevni unos kalorija'){
      return false;
    }
    return true;
  }

  getMealTypeClass(mealType: string): string {
    switch (mealType) {
      case "DORUCAK":
      case "RUCAK":
      case "VECERA":
        return 'main-meal';
      case "JUTARNJA UZINA":      
      case "POPODNEVNA UZINA":
        return 'snack';
      case "SALATA UZ RUCAK":
      case "SALATA UZ VECERU":
        return 'salad';
      default:
        return '';
    }
  }

  collectMeals(): void {
    this.service.getMeals().subscribe({
      next: (result: Meal[]) => {
        this.allMeals = result;
        this.refreshMeals();
        this.mealsVisible = true;
      },
      error: () => { }
    });
    
  }

  refreshMeals(): void {
    if (!this.weeklyMenu) return;
  
    const breakfastIds: number[] = [];
    const lunchIds: number[] = [];
    const dinnerIds: number[] = [];
    const saladIds: number[] = [];
    const snackIds: number[] = [];
  
    for (const dailyMenu of this.weeklyMenu.menu!) {
      for (const mealOffer of dailyMenu.menu) {
        switch (mealOffer.type) {
          case MealType.BREAKFAST:
            breakfastIds.push(mealOffer.mealId);
            break;
          case MealType.LUNCH:
            lunchIds.push(mealOffer.mealId);
            break; 
          case MealType.DINNER:
            dinnerIds.push(mealOffer.mealId);
            break;
          case MealType.LUNCH_SALAD:
          case MealType.DINNER_SALAD:
            saladIds.push(mealOffer.mealId);
            break; 
          case MealType.MORNING_SNACK:
          case MealType.DINNER_SNACK: 
            snackIds.push(mealOffer.mealId);
            break;
          default:
            break; 
        }
      }
    }
  
    this.breakfasts = this.allMeals.filter(meal => breakfastIds.includes(meal.id!));
    this.lunches = this.allMeals.filter(meal => lunchIds.includes(meal.id!));
    this.dinners = this.allMeals.filter(meal => dinnerIds.includes(meal.id!));
    this.salads = this.allMeals.filter(meal => saladIds.includes(meal.id!));
    this.snacks = this.allMeals.filter(meal => snackIds.includes(meal.id!));
    
  }

  getMealTypeByName(name: string): MealType | undefined {
    const keys = Object.keys(MealType).filter(k => isNaN(Number(k)));
    for (const key of keys) {
      if (MealTypeLabels[MealType[key as keyof typeof MealType]] === name) {
        return MealType[key as keyof typeof MealType];
      }
    }
    return undefined;
  }

  changeMenu(): void{
    if(this.buttonsVisible){
      this.buttonsVisible = false;
    }else{
      this.buttonsVisible = true;
    }
    
  }

  openModal(mealTypeName: string, day: DayOfWeek): void {
    const mealType = this.getMealTypeByName(mealTypeName);
    const dayName = this.daysOfWeek.find(d => d.value === day)?.name;
    const dailyMealOffers = this.weeklyMenu?.menu?.find(d => d.dayOfWeek === day);
    const mealOffer = dailyMealOffers?.menu?.find(m => m.type === mealType);
  
    const dialogRef = this.dialog.open(EditCalorieBasedMenuModalComponent, {
      width: '500px',
      data: { mealOffer, dayName }
    });
  
    dialogRef.afterClosed().subscribe((updatedMealOffer: MealOffer) => {
      if (updatedMealOffer) {
        console.log('The dialog was closed with result:', updatedMealOffer);       

        const dayMenu = this.weeklyMenu?.menu?.find(d => d.dayOfWeek === day);
        if (dayMenu) {
            const meal = dayMenu.menu?.find(m => m.type === mealType);
            if (meal) {        
                Object.assign(meal, updatedMealOffer);
            }
        }

        const dataSourceRow = this.dataSource.find(row => row.mealType === MealTypeLabels[mealType!]);
        if (dataSourceRow) {
          dataSourceRow[day.toString()] = `${updatedMealOffer.mealName} \n (${updatedMealOffer.calories?.toFixed(2)} kcal)`;
        }
        this.dataSource = [...this.dataSource];   
        this.refreshMeals();
        
      } else {
        console.log('The dialog was closed without result');
      }
    });
  }
  
  async exportToPDF(): Promise<void> {
    this.buttonsVisible = false;
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });

    const snackBarRef = this.snackBar.open('Preuzimanje fajla je u toku, sacekajte...', 'Zatvori', {
      verticalPosition: 'top',
      panelClass: ['mat-info'],
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
    snackBarRef.dismiss();
  }
  
}  