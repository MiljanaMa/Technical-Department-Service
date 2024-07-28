import { Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DayOfWeekTab } from '../model/day-of-week-tab';
import { Meal } from '../model/meal.model';
import { ConsumerType, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { KitchenService } from '../kitchen.service';
import { DailyMenu, DayOfWeek } from '../model/daily-menu.model';
import { WeeklyMenu } from '../model/weekly-menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  mealForm: FormGroup;
  meals: Meal[] = [];

  pregnantFilteredOptions: Observable<Meal[]> = of([]);
  operatedFilteredOptions: Observable<Meal[]> = of([]);
  mildFilteredOptions: Observable<Meal[]> = of([]);
  standardFilteredOptions: Observable<Meal[]> = of([]);
  doctorsFilteredOptions: Observable<Meal[]> = of([]);
  childrenFrom2To4FilteredOptions: Observable<Meal[]> = of([]);
  childrenFrom4To14FilteredOptions: Observable<Meal[]> = of([]);
  diabeticFilteredOptions: Observable<Meal[]> = of([]);


  daysOfWeekTabs: DayOfWeekTab[] = 
  [
    {id: 1, name: "Ponedeljak", date: new Date(2024, 6, 17), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 2, name: "Utorak", date: new Date(2024, 6, 18), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 3, name: "Sreda", date: new Date(2024, 6, 19), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 4, name: "Cetvrtak", date: new Date(2024, 6, 20), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 5, name: "Petak", date: new Date(2024, 6, 21), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 6, name: "Subota", date: new Date(2024, 6, 22), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
    {id: 7, name: "Nedelja", date: new Date(2024, 6, 23), breakfastChecked: false, lunchChecked: false, dinnerChecked: false, morningSnackChecked: false, dinnerSnackChecked: false, lunchSaladChecked: false, dinnerSaladChecked: false },
  ]

  mealTypes = Object.keys(MealType)
  .filter(key => !isNaN(Number(MealType[key as keyof typeof MealType])))
  .map(key => ({
    name: MealTypeLabels[MealType[key as keyof typeof MealType] as keyof typeof MealTypeLabels],
    value: MealType[key as keyof typeof MealType]
  }));

  //selectedDay: any = null;
  //selectedMealType: any = null;
  selectedDayIndex: number = 0;
  selectedMealIndex = 0;

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
    this.getMeals();
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

  /*
  next(): void{
    
    const menus : DailyMenu[] = [];
    const weeklyMenu : WeeklyMenu = {from: new Date(), to: new Date()};

    this.service.addWeeklyMenu(weeklyMenu).subscribe({
      next: (result: WeeklyMenu) => {
        console.log("added weekly menu");
        const mealOffer :  MealOffer = {consumerType: ConsumerType.PREGNANT, meal: this.meals[0], mealId: this.meals[0].id!, type: MealType.LUNCH};
        const offers : MealOffer[] = [mealOffer];
        const dailyMenu : DailyMenu = {dayOfWeek: DayOfWeek.FRIDAY, menu: offers, weeklyMenuId: result.id};

        this.service.addDailyMenu(dailyMenu).subscribe({
          next: () => {
            console.log("added daily menu");

            

          }
        }); 
      },
      error: (error) => {
        console.log('Error saving menu:', error);
      },
    });
  }
  */

 next(): void {
  // Create a WeeklyMenu object with the formatted 'from' and 'to' dates
  const menus : DailyMenu[] = [];
  const weeklyMenu: WeeklyMenu = {
    from: this.formatDate(new Date()), 
    to: this.formatDate(new Date()),
    menu: menus
  };

  this.service.addWeeklyMenu(weeklyMenu).subscribe({
    next: (result: WeeklyMenu) => {
      console.log("Added weekly menu:", result);
      
      
      const offers : MealOffer[] = [];
      const dailyMenu : DailyMenu = {dayOfWeek: DayOfWeek.FRIDAY, menu: offers, weeklyMenuId: result.id};
      weeklyMenu.menu?.concat(dailyMenu);

      this.service.addDailyMenu(dailyMenu).subscribe({
        next: (resultDailyMenu: DailyMenu) => {
          console.log("added daily menu");
          const mealOffer :  MealOffer = {consumerType: ConsumerType.DIABETIC as ConsumerType, mealName: this.meals[0].name!, mealId: this.meals[0].id!, type: MealType.LUNCH, consumerQuanitity: 0, dailyMenuId: resultDailyMenu.id};
          resultDailyMenu.menu.push(mealOffer);
          console.log(resultDailyMenu.menu);

          this.service.addMealOffer(mealOffer).subscribe({
            next: () => {
              console.log("changed daily menu");
            },
            error: (error) => {
              console.error('Error adding meal offer: ', error);
              if (error.error && error.error.errors) {
                console.log('Validation errors:', error.error.errors);
              }
            }
          })
        },
        error: (error) => {
          console.error('Error saving daily menu:', error);
          if (error.error && error.error.errors) {
            console.log('Validation errors:', error.error.errors);
          }
        }
      }); 
    },
    error: (error) => {
      console.error('Error saving weekly menu:', error);
      if (error.error && error.error.errors) {
        console.log('Validation errors:', error.error.errors);
      }
    }
  });
}

// Utility function to format date to 'YYYY-MM-DD'
private formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}


 

}
