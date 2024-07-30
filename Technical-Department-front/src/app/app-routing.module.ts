import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomMenuComponent } from './kitchen/custom-menu/custom-menu.component';
import { MealsComponent } from './kitchen/meals/meals.component';
import { IngredientsComponent } from './kitchen/ingredients/ingredients.component';
import { DailyMenuComponent } from './kitchen/daily-menu/daily-menu.component';
import { NewMenuComponent } from './kitchen/new-menu/new-menu.component';
import { TabularMenuComponent } from './kitchen/tabular-menu/tabular-menu.component';

const routes: Routes = [
  {path: 'new-menu', component: NewMenuComponent},
  {path: 'meals', component: MealsComponent},
  {path: 'ingredients', component: IngredientsComponent},
  {path: 'test', component: DailyMenuComponent},
  {path: 'custom-menu', component: CustomMenuComponent},
  {path: 'tabular-menu', component: TabularMenuComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
