import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IngredientQuantity, Meal } from './model/meal.model';
import { environment } from 'src/env/environment';
import { DailyMenu } from './model/daily-menu.model';
import { WeeklyMenu } from './model/weekly-menu.model';
import { MealOffer } from './model/meal-offer.model';
import { Ingredient } from './model/ingredient.model';
import { MeasurementUnit } from './model/measurementUnit.model';
import { KitchenWarehouseIngredient } from './model/kitchen-warehouse-ingredient';
import { WarehouseIngredient } from './model/warehouse-ingredient';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  constructor(private http: HttpClient) { }

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(environment.apiHost + 'meal');
  }

  addMealOffer(mealOffer: MealOffer): Observable<Boolean> {
    return this.http.post<Boolean>(`${environment.apiHost}weekly-menu/add-meal-offer`, mealOffer);
  }
  
  createOrFetchWeeklyMenu(weeklyMenu: WeeklyMenu): Observable<WeeklyMenu> {
    return this.http.post<WeeklyMenu>(environment.apiHost + `weekly-menu`, weeklyMenu);
  }

  createDraftFromDefaultMenu(weeklyMenu: WeeklyMenu): Observable<WeeklyMenu> {
    return this.http.post<WeeklyMenu>(environment.apiHost + `weekly-menu/default`, weeklyMenu);
  }

  confirmWeeklyMenu(weeklyMenu: WeeklyMenu): Observable<WeeklyMenu>{
    return this.http.put<WeeklyMenu>(environment.apiHost + `weekly-menu/confirm`, weeklyMenu)
  }
  getIngredientsRequirements(weeklyMenu: WeeklyMenu): Observable<IngredientQuantity[]>{
    return this.http.put<IngredientQuantity[]>(environment.apiHost + `weekly-menu/get-ingredients-requirements`, weeklyMenu)
  }

  getMenu(menuStatus: string): Observable<WeeklyMenu> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("status", menuStatus);
    return this.http.get<WeeklyMenu>(environment.apiHost + `weekly-menu/status`, {params: queryParams})
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
  getAllIngredientsPaged(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(environment.apiHost + 'ingredient');
  }
  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(environment.apiHost + 'ingredient/all');
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

  resetDraftMenu(weeklyMenu: WeeklyMenu): Observable<WeeklyMenu> {
    return this.http.put<WeeklyMenu>(environment.apiHost + `weekly-menu/reset-draft-menu`, weeklyMenu)
  }
  proceedExcel(formData: FormData): Observable<WarehouseIngredient[]> {
    return this.http.post<WarehouseIngredient[]>('http://localhost:5000/proceedExcel', formData);
  }
  startNewBusinessYear(ingredients: KitchenWarehouseIngredient[]): Observable<KitchenWarehouseIngredient[]> {
    return this.http.post<KitchenWarehouseIngredient[]>(environment.apiHost + `kitchenWarehouse`, ingredients);
  }
  getKitchenWarehouse(): Observable<KitchenWarehouseIngredient[]> {
    return this.http.get<KitchenWarehouseIngredient[]>(environment.apiHost + `kitchenWarehouse`);
  }
  
}
