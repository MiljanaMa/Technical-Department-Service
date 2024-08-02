import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomMenuComponent } from './kitchen/custom-menu/custom-menu.component';
import { MealsComponent } from './kitchen/meals/meals.component';
import { IngredientsComponent } from './kitchen/ingredients/ingredients.component';
import { MenusComponent } from './kitchen/menus/menus.component';
import { TabularMenuComponent } from './kitchen/tabular-menu/tabular-menu.component';
import { MealFormComponent } from './kitchen/meal-form/meal-form.component';

const routes: Routes = [
  {path: 'menus', component: MenusComponent},
  {path: 'meals', component: MealsComponent},
  {path: 'ingredients', component: IngredientsComponent},
  {path: 'custom-menu', component: CustomMenuComponent},
  {path: 'tabular-menu/:status', component: TabularMenuComponent},
  {path: 'meal-form/:id', component: MealFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
