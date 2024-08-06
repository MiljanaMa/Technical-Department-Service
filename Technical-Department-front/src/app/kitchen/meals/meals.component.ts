import { Component, OnInit } from '@angular/core';
import { Meal } from '../model/meal.model';
import { KitchenService } from '../kitchen.service';
import { FormControl } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  meals: Meal[] = [];
  filteredMeals: Meal[] = []; 
  searchControl = new FormControl();
  
  constructor(private service: KitchenService, private router: Router){}

  ngOnInit() {
    this.loadMeals();
    this.searchControl.valueChanges.subscribe(value => this.searchMeals(value));
  }
  loadMeals(): void{
    this.service.getMeals().subscribe({
      next: (result: any) => {
        this.meals = result;
        this.filteredMeals = result;
      },
      error: () => {
        //add some toast
      }
    })
  }
  searchMeals(query: string): void {
    const lowerCaseQuery = query.toLowerCase();
    this.filteredMeals = this.meals.filter(meal =>
      meal.name.toLowerCase().includes(lowerCaseQuery));
  }
  addMeal(): void {
    this.router.navigate([`/meal-form/null`]);
  }
  updateMeal(meal: Meal): void {
    this.router.navigate([`/meal-form/${meal.id}`]);
  }
  deleteMeal(mealId: number): void {
    this.service.deleteMeal(mealId).subscribe({
      next: (result: any) => {
        this.loadMeals();
      },
      error: () => {
        //add some toast
      }
    })
  }
}
