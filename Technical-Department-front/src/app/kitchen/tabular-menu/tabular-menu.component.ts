import { Component, OnInit } from '@angular/core';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { WeeklyMenu } from '../model/weekly-menu.model';
import { KitchenService } from '../kitchen.service';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tabular-menu',
  templateUrl: './tabular-menu.component.html',
  styleUrls: ['./tabular-menu.component.css']
})
export class TabularMenuComponent implements OnInit {

  weeklyMenu: WeeklyMenu | undefined;
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

  displayedColumns: string[] = ['consumerType', ...this.mealTypes.map(mealType => mealType.value.toString())];

  constructor(private service: KitchenService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.service.getDraftMenu(1).subscribe({
      next: (result: WeeklyMenu) => {
        this.weeklyMenu = result;
             
        if (this.weeklyMenu.menu && this.weeklyMenu.menu.length > 0) {
          this.selectedDailyMenu = this.weeklyMenu.menu.find(menu => menu.dayOfWeek === DayOfWeek.MONDAY);
          if (!this.selectedDailyMenu) {
            console.log("No monday")
            this.selectedDailyMenu = this.weeklyMenu.menu[0];
          }
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

  onSelectedDayTabChange(event: any): void {
    const selectedDayOfWeek = this.daysOfWeek[event.index].value;
    console.log("Selected day of week tab: " + selectedDayOfWeek);
    if (this.weeklyMenu && this.weeklyMenu.menu) {
      for (const dailyMenu of this.weeklyMenu.menu) {
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

  getConsumerTypeByName(name: string): ConsumerType | undefined {
    const keys = Object.keys(ConsumerType).filter(k => isNaN(Number(k)));
    for (const key of keys) {
      if (ConsumerTypeLabels[ConsumerType[key as keyof typeof ConsumerType]] === name) {
        return ConsumerType[key as keyof typeof ConsumerType];
      }
    }
    return undefined;
  }

  openModal(mealType: MealType, consumerTypeName: string): void {
    const consumerType = this.getConsumerTypeByName(consumerTypeName);
    const mealOffer = this.mealOffers.find(offer => offer.type === mealType && offer.consumerType === consumerType && offer.dailyMenuId === this.selectedDailyMenu?.id);
    
    if (mealOffer) {
      const dialogRef = this.dialog.open(EditMealDialogComponent, {
        width: '250px',
        data: { mealOffer }
      });
  
      dialogRef.afterClosed().subscribe((result: MealOffer) => {
        if (result) {
          console.log('The dialog was closed with result:', result);
          this.updateMealOffer(result);
          
        } else {
          console.log('The dialog was closed without result');
        }
      });
    } else {
      console.error('Meal offer not found for the given criteria.');
    }
  }
  

  updateMealOffer(updatedOffer: MealOffer): void {
    const index = this.mealOffers.findIndex(offer => 
      offer.type === updatedOffer.type && 
      offer.consumerType === updatedOffer.consumerType && 
      offer.dailyMenuId === updatedOffer.dailyMenuId
    );
  
    if (index !== -1) {
      this.mealOffers[index] = updatedOffer;
    } else {
      this.mealOffers.push(updatedOffer);
    }
  
    this.updateDataSource();
  }
  
  
}
