import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MealsComponent } from './meals/meals.component';
import { MaterialModule } from '../utils/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyMenuComponent } from './daily-menu/daily-menu.component';
import { MealChangeModalComponent } from './meal-change-modal/meal-change-modal.component';
import { NewMenuComponent } from './new-menu/new-menu.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    CustomMenuComponent,
    IngredientsComponent,
    MealsComponent,
    DailyMenuComponent,
    MealChangeModalComponent,
    NewMenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    CustomMenuComponent,
    IngredientsComponent,
    MealsComponent,
    CommonModule
  ]
})
export class KitchenModule { }