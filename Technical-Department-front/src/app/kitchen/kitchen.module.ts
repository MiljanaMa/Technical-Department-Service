import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MealsComponent } from './meals/meals.component';
import { MaterialModule } from '../utils/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MenusComponent } from './menus/menus.component';
import { AppRoutingModule } from '../app-routing.module';
import { TabularMenuComponent } from './tabular-menu/tabular-menu.component';
import { EditMealDialogComponent } from './edit-meal-dialog/edit-meal-dialog.component';
import { IngredientModalComponent } from './ingredient-modal/ingredient-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MealFormComponent } from './meal-form/meal-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { ConsumerQuantityComponent } from './consumer-quantity/consumer-quantity.component';

@NgModule({
  declarations: [
    CustomMenuComponent,
    IngredientsComponent,
    MealsComponent,
    MenusComponent,
    TabularMenuComponent,
    EditMealDialogComponent,
    IngredientModalComponent,
    MealFormComponent,
    ConsumerQuantityComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatChipsModule
  ],
  exports: [
    CustomMenuComponent,
    IngredientsComponent,
    MealsComponent,
    CommonModule
  ]
})
export class KitchenModule { }