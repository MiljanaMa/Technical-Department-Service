import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MealsComponent } from './meals/meals.component';
import { MaterialModule } from '../utils/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyMenuComponent } from './daily-menu/daily-menu.component';
import { MealChangeModalComponent } from './meal-change-modal/meal-change-modal.component';

@NgModule({
  declarations: [
    MenuComponent,
    IngredientsComponent,
    MealsComponent,
    DailyMenuComponent,
    MealChangeModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    MenuComponent,
    IngredientsComponent,
    MealsComponent,
    CommonModule
  ]
})
export class KitchenModule { }