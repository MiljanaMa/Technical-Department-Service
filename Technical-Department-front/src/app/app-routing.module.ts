import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomMenuComponent } from './kitchen/custom-menu/custom-menu.component';
import { MealsComponent } from './kitchen/meals/meals.component';
import { IngredientsComponent } from './kitchen/ingredients/ingredients.component';
import { MenusComponent } from './kitchen/menus/menus.component';
import { TabularMenuComponent } from './kitchen/tabular-menu/tabular-menu.component';
import { MealFormComponent } from './kitchen/meal-form/meal-form.component';
import { ConsumerQuantityComponent } from './kitchen/consumer-quantity/consumer-quantity.component';
import { YearlyExcelImportComponent } from './kitchen/yearly-excel-import/yearly-excel-import.component';
import { KitchenWarehouseComponent } from './kitchen/kitchen-warehouse/kitchen-warehouse.component';
import { CalorieBasedMenuComponent } from './kitchen/calorie-based-menu/calorie-based-menu.component';

const routes: Routes = [
  {path: 'menus', component: MenusComponent},
  {path: 'meals', component: MealsComponent},
  {path: 'ingredients', component: IngredientsComponent},
  {path: 'custom-menu', component: CustomMenuComponent},
  {path: 'tabular-menu/:status', component: TabularMenuComponent},
  {path: 'meal-form/:id', component: MealFormComponent},
  {path: 'consumer-quantity', component: ConsumerQuantityComponent},
  {path: 'yearly-excel-import', component: YearlyExcelImportComponent},
  {path: 'kitchen-warehouse', component: KitchenWarehouseComponent},
  {path: 'calorie-based-menu', component: CalorieBasedMenuComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
