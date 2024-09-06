import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WarehouseIngredient } from '../model/warehouse-ingredient';
import { KitchenService } from '../kitchen.service';
import { Ingredient } from '../model/ingredient.model';
import * as stringSimilarity from 'string-similarity';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IngredientModalComponent } from '../ingredient-modal/ingredient-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { IngredientsModalComponent } from '../ingredients-modal/ingredients-modal.component';
import { KitchenWarehouseIngredient } from '../model/kitchen-warehouse-ingredient';
import { Router } from '@angular/router';

@Component({
  selector: 'app-yearly-excel-import',
  templateUrl: './yearly-excel-import.component.html',
  styleUrls: ['./yearly-excel-import.component.css']
})
export class YearlyExcelImportComponent implements OnInit{
  selectedFile: File | null = null;
  sheetName: string = '';
  warehouseIngredients: WarehouseIngredient[] = []
  kitchenIngredients: Ingredient[] = []

  constructor(private service: KitchenService, private dialog: MatDialog, private snackBar: MatSnackBar,
    private router: Router) {}

  ngOnInit(): void {
    this.service.getAllIngredients().subscribe({
      next:(result: Ingredient[]) => {
        this.kitchenIngredients = result;

      },
      error: (error) => {
        // Handle error
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadFile() {
    if (this.selectedFile && this.sheetName) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('sheet', this.sheetName);

      this.service.proceedExcel(formData).subscribe({
        next:(result: WarehouseIngredient[]) => {
          this.warehouseIngredients = result;
          this.findMatchingIngredients();

        },
        error: (error) => {
          // Handle error
        }
      });
    }
  }
  findMatchingIngredients(): void {
    const kitchenIngredientNames = this.kitchenIngredients.map(kitchenIng => kitchenIng.name);
    this.warehouseIngredients.forEach(element => {
      const bestMatch = stringSimilarity.findBestMatch(element.name, kitchenIngredientNames);
      const bestMatchRating = bestMatch.bestMatch.rating;
      const similarityThreshold = 0.3;
      if (bestMatchRating >= similarityThreshold) {
        const bestMatchName = bestMatch.bestMatch.target;
        element.ingredient = this.kitchenIngredients.find(kitchenIng => kitchenIng.name === bestMatchName);
      }
    });
  }
  confirmRow(ingredient: WarehouseIngredient) {
    ingredient.isConfirmed = !ingredient.isConfirmed; // Mark the ingredient as confirmed
  }
  openAddIngredientDialog(warehouseIngredient: WarehouseIngredient): void {
    const dialogRef = this.dialog.open(IngredientModalComponent, {
      width: '450px',
      height: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        warehouseIngredient.ingredient = result;
      }
    });
  }
  startNewBusinessYear(): void {
    if(!this.warehouseIngredients.every(i => i.isConfirmed)){
      this.snackBar.open('Potvrdite sve redove, pa pokušajte ponovo', 'OK', {
        duration: 3000, 
        verticalPosition: 'top',
        panelClass: ['mat-warn'] 
      });
    }else{
      var kitchenIngredients: KitchenWarehouseIngredient[] = [];
      this.warehouseIngredients.forEach(element => {
        kitchenIngredients.push(this.transformToKitchenWarehouseIngredient(element));
      });
      this.service.startNewBusinessYear(kitchenIngredients).subscribe({
        next:(result: KitchenWarehouseIngredient[]) => {
          this.snackBar.open('Uspjesno ste započeli novu poslovnu godinu', 'OK', {
            duration: 3000, 
            verticalPosition: 'top',
            panelClass: ['mat-warn'] 
          });
          this.router.navigate([`kitchen-warehouse`]);
        },
        error: (error) => {
          // Handle error
        }
      });
    }
  }
  transformToKitchenWarehouseIngredient(warehouseIngredient: WarehouseIngredient): KitchenWarehouseIngredient {
    return {
      measurementUnitScale: warehouseIngredient.scale,
      quantity: 0,
      warehouseLabel: warehouseIngredient.name,
      ingredientId: warehouseIngredient.ingredient?.id || 0,
      ingredient: warehouseIngredient.ingredient as Ingredient
    };
  }
  openSearchIngredientDialog(warehouseIngredient: WarehouseIngredient): void {
    const dialogRef = this.dialog.open(IngredientsModalComponent, {
      width: '450px',
      height: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        warehouseIngredient.ingredient = result;
      }
    });
  }
  
}