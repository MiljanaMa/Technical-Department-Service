import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Meal } from './model/meal.model';
import { environment } from 'src/env/environment';
import { DailyMenu } from './model/daily-menu.model';
import { WeeklyMenu } from './model/weekly-menu.model';
import { MealOffer } from './model/meal-offer.model';
import { Ingredient } from './model/ingredient.model';
import { MeasurementUnit } from './model/measurementUnit.model';

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

  getMeal(mealId: number): Observable<Meal> {
    return this.http.get<Meal>(environment.apiHost + 'meal/' + mealId);
  }
  createMeal(meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(environment.apiHost + 'meal', meal);
  }
  deleteMeal(mealId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'meal/' + mealId);
  }
  updateMeal(meal: Meal): Observable<Meal> {
    return this.http.put<Meal>(environment.apiHost + `meal/${meal.id}`, meal);
  }
  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(environment.apiHost + 'ingredient');
  }
  createIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(environment.apiHost + 'ingredient', ingredient);
  }
  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(environment.apiHost + `ingredient/${ingredient.id}`, ingredient);
  }
  deleteIngredient(ingredientId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'ingredient/' + ingredientId);
  }
  getAllMeasurementUnits(): Observable<MeasurementUnit[]> {
    return this.http.get<MeasurementUnit[]>(environment.apiHost + 'measurementUnit');
  }
  
}
