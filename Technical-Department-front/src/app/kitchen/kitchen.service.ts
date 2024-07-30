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

  addMealOffer(mealOffer: MealOffer): Observable<DailyMenu> {
    return this.http.post<DailyMenu>(`${environment.apiHost}daily-menu/add-meal-offer`, mealOffer);
  }
  
  addOrFetchWeeklyMenu(weeklyMenu: WeeklyMenu): Observable<WeeklyMenu> {
    return this.http.post<WeeklyMenu>(environment.apiHost + 'weekly-menu', weeklyMenu);
  }

  getDraftMenu(id: number): Observable<WeeklyMenu> {
    return this.http.get<WeeklyMenu>(environment.apiHost + 'weekly-menu/draft')
  }
}
