import { Component, OnInit } from '@angular/core';
import { KitchenWarehouseIngredient } from '../model/kitchen-warehouse-ingredient';
import { KitchenService } from '../kitchen.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kitchen-warehouse',
  templateUrl: './kitchen-warehouse.component.html',
  styleUrls: ['./kitchen-warehouse.component.css']
})
export class KitchenWarehouseComponent implements OnInit {
public ingredients: KitchenWarehouseIngredient[] = [];
searchControl = new FormControl();

constructor(private service: KitchenService, private router: Router){}
ngOnInit(): void {
  this.service.getKitchenWarehouse().subscribe({
    next:(result: KitchenWarehouseIngredient[]) => {
      this.ingredients = result;
    },
    error: (error) => {
      // Handle error
    }
  });
}

showYearlyExcelImport(): void{
  this.router.navigate([`/yearly-excel-import`]);
}

}
