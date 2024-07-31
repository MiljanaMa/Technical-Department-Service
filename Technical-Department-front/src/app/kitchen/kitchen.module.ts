import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { MealsComponent } from './meals/meals.component';
import { MaterialModule } from '../utils/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NewMenuComponent } from './new-menu/new-menu.component';
import { AppRoutingModule } from '../app-routing.module';
import { TabularMenuComponent } from './tabular-menu/tabular-menu.component';
import { EditMealDialogComponent } from './edit-meal-dialog/edit-meal-dialog.component';

@NgModule({
  declarations: [
    CustomMenuComponent,
    IngredientsComponent,
    MealsComponent,
    NewMenuComponent,
    TabularMenuComponent,
    EditMealDialogComponent
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