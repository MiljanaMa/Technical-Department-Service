import { Component, OnInit } from '@angular/core';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { WeeklyMenu, WeeklyMenuStatus } from '../model/weekly-menu.model';
import { KitchenService } from '../kitchen.service';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabular-menu',
  templateUrl: './tabular-menu.component.html',
  styleUrls: ['./tabular-menu.component.css']
})
export class TabularMenuComponent implements OnInit {

  routeParamMenuStatus: string = "";
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

  constructor(private service: KitchenService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.routeParamMenuStatus = params.get('status') || 'DRAFT'; 

      this.service.getMenu(this.routeParamMenuStatus).subscribe({
        next: (result: WeeklyMenu) => {
          this.weeklyMenu = result;
               
          if (this.weeklyMenu.menu && this.weeklyMenu.menu.length > 0) {
            this.selectedDailyMenu = this.weeklyMenu.menu.find(menu => menu.dayOfWeek === DayOfWeek.MONDAY);
            console.log(this.selectedDailyMenu);
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
  
  getDayDate(dayIndex: number): string {
    if (!this.weeklyMenu?.from) return '';

    const fromDate = new Date(this.weeklyMenu.from);
    fromDate.setDate(fromDate.getDate() + dayIndex);
    return this.formatToDayMonthYear(fromDate);
  }

  formatToDayMonthYear(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }


  
  confirmMenu() : void {

    this.weeklyMenu!.status = WeeklyMenuStatus.NEW;

    this.service.confirmWeeklyMenu(this.weeklyMenu!).subscribe({
      next: (result: WeeklyMenu) => {
        this.router.navigate(['/menus']);
    },
      error: (error) => {
        console.error('Error updating weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
    
  }

  
  shouldRenderSnackInput(mealType: MealType, consumerTypeName: string): boolean {
    const consumerType = this.getConsumerTypeByName(consumerTypeName);
    const snackEligibleConsumerTypes = [ConsumerType.DIABETIC, ConsumerType.PREGNANT, ConsumerType.CHILDREN_2_4, ConsumerType.CHILDREN_4_14];
    const snackMealTypes = [MealType.MORNING_SNACK, MealType.DINNER_SNACK];
    const otherMealTypes = [MealType.BREAKFAST, MealType.DINNER, MealType.DINNER_SALAD, MealType.LUNCH, MealType.LUNCH_SALAD]
    return  otherMealTypes.includes(mealType) || (snackMealTypes.includes(mealType) && snackEligibleConsumerTypes.includes(consumerType!));
  }
}
