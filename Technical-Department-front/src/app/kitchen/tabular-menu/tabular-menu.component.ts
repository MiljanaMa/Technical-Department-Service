import { Component, OnInit } from '@angular/core';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { WeeklyMenu, WeeklyMenuStatus } from '../model/weekly-menu.model';
import { KitchenService } from '../kitchen.service';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tabular-menu',
  templateUrl: './tabular-menu.component.html',
  styleUrls: ['./tabular-menu.component.css']
})
export class TabularMenuComponent implements OnInit {
  menuNameControl = new FormControl('', Validators.required);
  routeParamMenuId: number | undefined;
  weeklyMenu: WeeklyMenu | undefined;
  mealOffers: MealOffer[] = [];
  dailyMenu: any[] = [];

  selectedDailyMenu: DailyMenu | undefined;
  selectedDayIndex: number = 0;
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

  constructor(private service: KitchenService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.routeParamMenuId = Number(params.get('id')) || -1;
      console.log(this.routeParamMenuId);
      this.service.getMenuById(this.routeParamMenuId).subscribe({
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
    this.dailyMenu = this.consumerTypes.map(consumerType => {
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
    this.selectedDayIndex = this.daysOfWeek[event.index].value;
    console.log("AJDE:", this.selectedDayIndex)
    console.log("NESTO")
    const selectedDayOfWeek = this.daysOfWeek[event.index].value;
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
    console.log(consumerType,mealType)
    if (mealOffer) {
      const dialogRef = this.dialog.open(EditMealDialogComponent, {
        width: '500px',
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

  confirmMenu(): void {
    if (this.IsDefaultMenu()) {
      if (this.menuNameControl.valid && this.weeklyMenu) {
        this.weeklyMenu.name = this.menuNameControl.value!; 
        this.submitWeeklyMenu(this.weeklyMenu);
      } else {
        this.snackBar.open('Proverite da li je ime menija validno popunjeno.', 'OK', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['mat-warn']
        });
      }
    } else {
      this.submitWeeklyMenu(this.weeklyMenu!);
    }
  }
  
  private submitWeeklyMenu(menu: WeeklyMenu): void {
    this.service.confirmWeeklyMenu(menu).subscribe({
      next: () => {
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

  shouldRenderInput(mealType: MealType, consumerTypeName: string): boolean {
    const dayDate = this.getDayDate(this.selectedDayIndex!);
    const [day, month, year] = dayDate.split('/').map(Number);
    const dayDateObj = new Date(year + 2000, month - 1, day);
    const hasDatePassed = dayDateObj < new Date();
    const consumerType = this.getConsumerTypeByName(consumerTypeName);
    const snackEligibleConsumerTypes = [ConsumerType.DIABETIC, ConsumerType.PREGNANT, ConsumerType.CHILDREN_2_4, ConsumerType.CHILDREN_4_14];
    const snackMealTypes = [MealType.MORNING_SNACK, MealType.DINNER_SNACK];
    const saladEligibleConsumerTypes = [ConsumerType.PREGNANT, ConsumerType.MILD_PATIENT, ConsumerType.DOCTOR, ConsumerType.CHILDREN_2_4, ConsumerType.CHILDREN_4_14, ConsumerType.DIABETIC];
    const saladMealTypes = [MealType.LUNCH_SALAD, MealType.DINNER_SALAD];
    const otherMealTypes = [MealType.BREAKFAST, MealType.DINNER, MealType.LUNCH]
    return  !hasDatePassed && (otherMealTypes.includes(mealType) || (snackMealTypes.includes(mealType) && snackEligibleConsumerTypes.includes(consumerType!)) || (saladMealTypes.includes(mealType) && saladEligibleConsumerTypes.includes(consumerType!)));
  }

  IsDefaultMenu(): boolean{
    if([WeeklyMenuStatus.DRAFT_DEFAULT, WeeklyMenuStatus.DEFAULT].includes(this.weeklyMenu!.status))
      return true;
    else
      return false;
  }

}
