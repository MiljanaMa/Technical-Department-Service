import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meal } from './model/meal.model';
import { environment } from 'src/env/environment';
import { DailyMenu } from './model/daily-menu.model';
import { WeeklyMenu } from './model/weekly-menu.model';
import { MealOffer } from './model/meal-offer.model';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {

  constructor(private http: HttpClient) { }

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(environment.apiHost + 'meal');
  }

  addDailyMenu(dailyMenu: DailyMenu): Observable<DailyMenu> {
    return this.http.post<DailyMenu>(environment.apiHost + 'daily-menu', dailyMenu);
  }

  addMealOffer(mealOffer: MealOffer): Observable<DailyMenu> {
    return this.http.post<DailyMenu>(`${environment.apiHost}daily-menu/add-meal-offer`, mealOffer);
  }
  
  addWeeklyMenu(weeklyMenu: WeeklyMenu): Observable<WeeklyMenu> {
    return this.http.post<WeeklyMenu>(environment.apiHost + 'weekly-menu', weeklyMenu);
  }
}
