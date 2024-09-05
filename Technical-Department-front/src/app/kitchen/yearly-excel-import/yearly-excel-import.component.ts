import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WarehouseIngredient } from '../model/warehouse-ingredient';
import { KitchenService } from '../kitchen.service';
import { Ingredient } from '../model/ingredient.model';
import * as stringSimilarity from 'string-similarity';
import { MatDialog } from '@angular/material/dialog';
import { IngredientModalComponent } from '../ingredient-modal/ingredient-modal.component';

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

  constructor(private service: KitchenService, private dialog: MatDialog) {}

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
  findMatchingIngredient(warehouseIngredient: WarehouseIngredient): Ingredient | undefined {
    const kitchenIngredientNames = this.kitchenIngredients.map(kitchenIng => kitchenIng.name);
    const bestMatch = stringSimilarity.findBestMatch(warehouseIngredient.name, kitchenIngredientNames);
    const bestMatchRating = bestMatch.bestMatch.rating;
    const similarityThreshold = 0.3;
    if (bestMatchRating >= similarityThreshold) {
      const bestMatchName = bestMatch.bestMatch.target;
      warehouseIngredient.ingredient = this.kitchenIngredients.find(kitchenIng => kitchenIng.name === bestMatchName);
      return warehouseIngredient.ingredient;
    }
    return undefined;
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
  
}