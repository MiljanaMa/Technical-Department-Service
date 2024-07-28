import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MealsComponent } from './meals/meals.component';
import { MaterialModule } from '../utils/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DailyMenuComponent } from './daily-menu/daily-menu.component';
import { MealChangeModalComponent } from './meal-change-modal/meal-change-modal.component';
import { IngredientModalComponent } from './ingredient-modal/ingredient-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MenuComponent,
    IngredientsComponent,
    MealsComponent,
    DailyMenuComponent,
    MealChangeModalComponent,
    IngredientModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  exports: [
    MenuComponent,
    IngredientsComponent,
    MealsComponent,
    CommonModule
  ]
})
export class KitchenModule { }