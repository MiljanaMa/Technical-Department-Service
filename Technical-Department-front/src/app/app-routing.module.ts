import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './kitchen/menu/menu.component';
import { MealsComponent } from './kitchen/meals/meals.component';
import { IngredientsComponent } from './kitchen/ingredients/ingredients.component';
import { DailyMenuComponent } from './kitchen/daily-menu/daily-menu.component';
import { MealFormComponent } from './kitchen/meal-form/meal-form.component';

const routes: Routes = [
  {path: 'menu', component: MenuComponent},
  {path: 'meals', component: MealsComponent},
  {path: 'ingredients', component: IngredientsComponent},
  {path: 'test', component: DailyMenuComponent},
  {path: 'meal-form/:id', component: MealFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
