import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Meal } from './model/meal.model';
import { environment } from 'src/env/environment';
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
