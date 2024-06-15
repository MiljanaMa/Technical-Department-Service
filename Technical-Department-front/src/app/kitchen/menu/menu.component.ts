import { Component } from '@angular/core';
import { DayOfWeekTab } from '../model/dayOfWeekTab';
import { Meal } from '../model/meal.model';
import { MealType } from '../model/meal-offer.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  
  public mealForm: FormGroup;
  selectedDay: any = null;
  selectedMealType: any = null;
  selectedDayIndex: number = 0;
  selectedMealIndex = 0;

  constructor(){
    this.mealForm = new FormGroup({
      pregnant: new FormControl(''),
      operated: new FormControl(''),
      mild: new FormControl(''),
      standard: new FormControl(''),
      childrenFrom2To4: new FormControl(''),
      childrenFrom4To14: new FormControl(''),
      diabetic: new FormControl(''),
    })
  }

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

  mealTypes = Object.keys(MealType).map(key => ({ name: MealType[key as keyof typeof MealType] }));

  meals: Meal[] = 
  [
    {id: 1, name: "Jaja sa sirom", image: "https://bonapeti.rs/files/1200x800/barkaniqicasirene.webp"},
    { id: 2, name: "Pirinac sa piletinom", image: "https://static2stvarukusa.mondo.rs/api/v3/images/29051?ts=2021-06-30T12:46:55"}
  ]

  selectDay(day: any) {
    this.selectedDay = day;
  }

  selectMealType(index: number) {
    this.selectedMealIndex = index;
  }

  
}
