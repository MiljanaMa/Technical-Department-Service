import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, startWith, map } from 'rxjs';
import { KitchenService } from '../kitchen.service';
import { DishType, Meal } from '../model/meal.model';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { WeeklyMenu, WeeklyMenuStatus } from '../model/weekly-menu.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.css']
})
export class CustomMenuComponent implements OnInit {

  selectedDayTabIndex : number = 0;
  selectedMealTabIndex : number = 0;

  mealFormGroup: FormGroup = new FormGroup({});
  allMeals: Meal[] = [];
  weeklyMenu: WeeklyMenu | undefined;
  canConfirm: boolean = false;

  selectedMealType: MealType = MealType.BREAKFAST;
  mealTypes = Object.keys(MealType)
    .filter(key => !isNaN(Number(MealType[key as keyof typeof MealType])))
    .map(key => ({
      name: MealTypeLabels[MealType[key as keyof typeof MealType] as keyof typeof MealTypeLabels],
      value: MealType[key as keyof typeof MealType]
    }));

  selectedDailyMenuId: number | undefined;
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

  filteredOptions: { [key: string]: Observable<Meal[]> } = {};

  constructor(private service: KitchenService, private snackBar: MatSnackBar, private router: Router) {
    this.initializeEmptyFormGroup();
  }

  ngOnInit() {
    this.createInitialWeeklyMenu();
  }

  shouldRenderInput(mealType: MealType, consumerType: ConsumerType): boolean {
    const snackEligibleConsumerTypes = [ConsumerType.DIABETIC, ConsumerType.PREGNANT, ConsumerType.CHILDREN_2_4, ConsumerType.CHILDREN_4_14];
    const snackMealTypes = [MealType.MORNING_SNACK, MealType.DINNER_SNACK];
    const saladEligibleConsumerTypes = [ConsumerType.PREGNANT, ConsumerType.MILD_PATIENT, ConsumerType.DOCTOR, ConsumerType.CHILDREN_2_4, ConsumerType.CHILDREN_4_14, ConsumerType.DIABETIC];
    const saladMealTypes = [MealType.LUNCH_SALAD, MealType.DINNER_SALAD];
    const otherMealTypes = [MealType.BREAKFAST, MealType.DINNER, MealType.LUNCH]
    return  otherMealTypes.includes(mealType) || (snackMealTypes.includes(mealType) && snackEligibleConsumerTypes.includes(consumerType)) || (saladMealTypes.includes(mealType) && saladEligibleConsumerTypes.includes(consumerType));
  }

  initializeEmptyFormGroup() {
    this.daysOfWeek.forEach(day => {
      this.mealTypes.forEach(mealType => {
        this.consumerTypes.forEach(consumerType => {
          if (this.shouldRenderInput(mealType.value, consumerType.value)) {
          const controlName = this.getFormControlName(day.value, mealType.value, consumerType.value);
          this.mealFormGroup.addControl(controlName, new FormControl('', [this.validateMeal.bind(this)]));
          this.filteredOptions[controlName] = of([]);
          }
        });
      });
    });

    this.mealFormGroup.statusChanges.subscribe(status => {
      this.canConfirm = status === 'VALID';
    });
  }

  private isString(variable: any) {
    return typeof variable === "string";
  }

  validateMeal(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true }; 
    return this.isString(control.value) ? { invalidMeal: true } : null; 
  }


  createInitialWeeklyMenu(): void {
    const menus: DailyMenu[] = [];
    this.weeklyMenu = {
      from: this.formatDate(this.getNextMonday()),
      to: this.formatDate(this.getNextMondayPlusWeek()),
      menu: menus,
      status: WeeklyMenuStatus.DRAFT
    };

    this.service.createOrFetchWeeklyMenu(this.weeklyMenu).subscribe({
      next: (result: WeeklyMenu) => {
        this.weeklyMenu = result;
        console.log("Weekly menu:", result);
        this.selectedDailyMenuId = this.weeklyMenu.menu![0].id;
        this.getMeals();
      },
      error: (error) => {
        console.error('Error saving weekly menu:', error);
        if (error.error && error.error.errors) {
          console.log('Validation errors:', error.error.errors);
        }
      }
    });
  }

  getMeals(): void {
    this.service.getMeals().subscribe({
      next: (result: Meal[]) => {
        this.allMeals = result;
        this.initializeForms();
        
      },
      error: () => { }
    });
  }

  initializeForms() {
    if (!this.weeklyMenu?.menu) return;
  
    this.weeklyMenu.menu.forEach((dailyMenu, dayIndex) => {
      this.mealTypes.forEach((mealType, mealTypeIndex) => {
        this.consumerTypes.forEach(consumerType => {
          if (this.shouldRenderInput(mealType.value, consumerType.value)) {
            const controlName = this.getFormControlName(dailyMenu.dayOfWeek, mealType.value, consumerType.value);
            const formControl = this.mealFormGroup.get(controlName);
    
            if (formControl) {
              const existingMealOffer = dailyMenu.menu?.find(offer =>
                offer.consumerType === consumerType.value && offer.type === mealType.value
              );
    
              if (existingMealOffer) {
                const selectedMeal = this.allMeals.find(meal => meal.id === existingMealOffer.mealId);
                if (selectedMeal) {
                  formControl.setValue(selectedMeal);
                }
              }
    
              formControl.valueChanges.subscribe(value => {
                console.log("Form control value changed:", value);
                this.onFieldChange(consumerType.value, dailyMenu.dayOfWeek, mealType.value);
              });
    
              this.filteredOptions[controlName] = formControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value, mealType.value))
              );
            }
          }
        });
      });
    });
  }
  

  getFormControlName(day: DayOfWeek, mealType: MealType, consumerType: ConsumerType): string {
    return `${day}-${mealType}-${consumerType}`;
  }

  displayName(meal: Meal): string {
    return meal ? meal.name : '';
  }

  private _filter(value: any, mealType: MealType): Meal[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : (value.name || '').toLowerCase();
    const meals = this.getMealsForMealType(mealType)
    return meals.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private getMealsForMealType(mealType: MealType): Meal[] {
    switch (mealType) {
      case MealType.BREAKFAST:
        return this.allMeals.filter(m => m.types.includes(DishType.BREAKFAST));
      case MealType.MORNING_SNACK:      
      case MealType.DINNER_SNACK:
        return this.allMeals.filter(m => m.types.includes(DishType.SNACK));
      case MealType.LUNCH:
        return this.allMeals.filter(m => m.types.includes(DishType.LUNCH));
      case MealType.DINNER:
        return this.allMeals.filter(m => m.types.includes(DishType.DINNER));
      case MealType.LUNCH_SALAD:
      case MealType.DINNER_SALAD:
        return this.allMeals.filter(m => m.types.includes(DishType.SALAD));
      default:
        return this.allMeals;
    }
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

  onSelectedMealTabChange(event: any, dayIndex: number): void {
    this.selectedMealType = this.mealTypes[event.index].value;
    this.selectedMealTabIndex = this.mealTypes[event.index].value;
  }

  onSelectedDayTabChange(event: any): void {
    this.selectedDayTabIndex = this.daysOfWeek[event.index].value;
    if (this.weeklyMenu && this.weeklyMenu.menu) {
      for (const dailyMenu of this.weeklyMenu.menu) {
        if (dailyMenu.dayOfWeek === this.selectedDayTabIndex) {
          this.selectedDailyMenuId = dailyMenu.id;
          break;
        }
      }
    }
  }

  onFieldChange(consumerType: ConsumerType, day: DayOfWeek, mealType: MealType): void {
    const controlName = this.getFormControlName(day, mealType, consumerType);
    const mealNameControl = this.mealFormGroup.get(controlName);
    if (mealNameControl) {
      const selectedMeal = this.allMeals.find(m => m === mealNameControl.value);
      if (selectedMeal) {
        const mealOffer: MealOffer = {
          consumerType,
          mealName: selectedMeal.name!,
          mealId: selectedMeal.id!,
          type: mealType,
          consumerQuantity: 0,
          dailyMenuId: this.selectedDailyMenuId
        };
        this.service.addMealOffer(mealOffer).subscribe({
          next: () => {
            console.log("Added/changed meal offer");          
          },
          error: (error) => {
            console.error('Error adding meal offer: ', error);
            if (error.error && error.error.errors) {
              console.log('Validation errors:', error.error.errors);
            }
          }
        });
      }
    }
  }

  showNextTab(): void{
    if(this.selectedMealTabIndex < 6){
      this.selectedMealTabIndex = this.selectedMealTabIndex + 1;
    }else{
      if(this.selectedDayTabIndex < 6){
        this.selectedDayTabIndex = this.selectedDayTabIndex + 1;
        this.selectedMealTabIndex = 0;
      }
    }
    
  }

  showTabularView(): void {
    if (!this.mealFormGroup.valid) {
      this.snackBar.open('Proverite da li su sve forme validno popunjene.', 'OK', {
        duration: 3000, 
        verticalPosition: 'top',
        panelClass: ['mat-warn'] 
      });
      return;
    }else{
      this.router.navigate(['/tabular-menu/draft']);
    }
  }

  isDayValid(day: DayOfWeek): boolean {
    let isValid = true;
    this.mealTypes.forEach(mealType => {
      this.consumerTypes.forEach(consumerType => {
        const controlName = this.getFormControlName(day, mealType.value, consumerType.value);
        const control = this.mealFormGroup.get(controlName);
        if (control && control.invalid) {
          isValid = false;
        }
      });
    });
    return isValid;
  }

  isMealValid(day: DayOfWeek, mealType: MealType): boolean {
    let isValid = true;
    this.consumerTypes.forEach(consumerType => {
      const controlName = this.getFormControlName(day, mealType, consumerType.value);
      const control = this.mealFormGroup.get(controlName);
      if (control && control.invalid) {
        isValid = false;
      }
    });
    return isValid;
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

  getColumnsClass(mealType: MealType, consumerTypes: any[]): string {
    const snackMealTypes = [MealType.MORNING_SNACK, MealType.DINNER_SNACK];

    if (snackMealTypes.includes(mealType)) {
      return 'form-fields-container one-column';
    } else {
      return 'form-fields-container two-columns';
    }
  }
}