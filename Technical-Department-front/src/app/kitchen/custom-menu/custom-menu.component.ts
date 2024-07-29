import { Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DayOfWeekTab } from '../model/day-of-week-tab';
import { Meal } from '../model/meal.model';
import { ConsumerType, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { KitchenService } from '../kitchen.service';
import { DailyMenu, DayOfWeek, DayOfWeekLabels } from '../model/daily-menu.model';
import { WeeklyMenu, WeeklyMenuStatus } from '../model/weekly-menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.css']
})
export class CustomMenuComponent implements OnInit{
  mealForm: FormGroup;
  meals: Meal[] = [];
  weeklyMenu!: WeeklyMenu;

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

  pregnantFilteredOptions: Observable<Meal[]> = of([]);
  operatedFilteredOptions: Observable<Meal[]> = of([]);
  mildFilteredOptions: Observable<Meal[]> = of([]);
  standardFilteredOptions: Observable<Meal[]> = of([]);
  doctorsFilteredOptions: Observable<Meal[]> = of([]);
  childrenFrom2To4FilteredOptions: Observable<Meal[]> = of([]);
  childrenFrom4To14FilteredOptions: Observable<Meal[]> = of([]);
  diabeticFilteredOptions: Observable<Meal[]> = of([]);

  constructor(private service: KitchenService){
    
    this.mealForm = new FormGroup({
      pregnantFormControl: new FormControl(''),
      operatedFormControl: new FormControl(''),
      mildFormControl: new FormControl(''),
      standardFormControl: new FormControl(''),
      doctorsFormControl: new FormControl(''),
      childrenFrom2To4FormControl: new FormControl(''),
      childrenFrom4To14FormControl: new FormControl(''),
      diabeticFormControl: new FormControl(''),
    })
  }

  ngOnInit() {

    this.createInitialWeeklyMenu();
    this.getMeals();

    this.mealForm.get('pregnantFormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.PREGNANT));
    this.mealForm.get('operatedFormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.OPERATED_PATIENT));
    this.mealForm.get('mildFormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.MILD_PATIENT));
    this.mealForm.get('standardFormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.STANDARD_PATIENT));
    this.mealForm.get('doctorsFormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.DOCTOR));
    this.mealForm.get('childrenFrom2To4FormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.CHILDREN_2_4));
    this.mealForm.get('childrenFrom4To14FormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.CHILDREN_4_14));
    this.mealForm.get('diabeticFormControl')?.valueChanges.subscribe(value => this.onFieldChange(ConsumerType.DIABETIC));
  }

  getNextMonday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysUntilNextMonday = (7 - dayOfWeek + 1) % 7 || 7; // Days to next Monday
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

  createInitialWeeklyMenu(): void{
    const menus : DailyMenu[] = [];
    this.weeklyMenu = {
      from: this.formatDate(this.getNextMonday()), 
      to: this.formatDate(this.getNextMondayPlusWeek()),
      menu: menus,
      status: WeeklyMenuStatus.DRAFT
    };
  
    this.service.addWeeklyMenu(this.weeklyMenu).subscribe({
      next: (result: WeeklyMenu) => {
        this.weeklyMenu.menu = result.menu;
        console.log("Weekly menu:", result);     
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
        this.meals = result;

        this.pregnantFilteredOptions = this.initializeFilteredOptions('pregnantFormControl');
        this.operatedFilteredOptions = this.initializeFilteredOptions('operatedFormControl');
        this.mildFilteredOptions = this.initializeFilteredOptions('mildFormControl');
        this.standardFilteredOptions = this.initializeFilteredOptions('standardFormControl');
        this.doctorsFilteredOptions = this.initializeFilteredOptions('doctorsFormControl');
        this.childrenFrom2To4FilteredOptions = this.initializeFilteredOptions('childrenFrom2To4FormControl');
        this.childrenFrom4To14FilteredOptions = this.initializeFilteredOptions('childrenFrom4To14FormControl');
        this.diabeticFilteredOptions = this.initializeFilteredOptions('diabeticFormControl');
      },
      error: () => {
      }
    })
  }

  displayName(meal: Meal): string {
    return meal.name;
  }

  private initializeFilteredOptions(controlName: string): Observable<Meal[]> {
    return this.mealForm.get(controlName)!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : (value as any)?.name;
        return this._filter(name);
      })
    );
  }

  private _filter(name: string): Meal[] {
    const filterValue = name.toLowerCase();

    return this.meals.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSelectedMealTabChange(event: any): void {
    this.selectedMealType = this.mealTypes[event.index].value;
    console.log("Selected meal tab:" + this.selectedMealType); 
  }

 
  onSelectedDayTabChange(event: any): void {
    const selectedDayOfWeek = this.daysOfWeek[event.index].value;
    console.log("Selected day of week tab: " + selectedDayOfWeek); 
    if (this.weeklyMenu && this.weeklyMenu.menu) { 
      for (const dailyMenu of this.weeklyMenu.menu) {
        if (dailyMenu.dayOfWeek === selectedDayOfWeek) {
          this.selectedDailyMenuId = dailyMenu.id;
          break;
        }
      }
    }
  }

  onFieldChange(fieldConsumerType: ConsumerType): void{
    const mealOffer :  MealOffer = {consumerType: fieldConsumerType, mealName: this.meals[0].name!, mealId: this.meals[0].id!, type: this.selectedMealType, consumerQuantity: 0, dailyMenuId: this.selectedDailyMenuId};
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
    })
  }

}
