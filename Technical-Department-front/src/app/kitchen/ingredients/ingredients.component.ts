import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../kitchen.service';
import { Ingredient, IngredientType } from '../model/ingredient.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IngredientModalComponent } from '../ingredient-modal/ingredient-modal.component';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit{
  dialogRef: MatDialogRef<ConfirmationDialogComponent> | undefined;
  public ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  searchControl = new FormControl();
  
  constructor(private service: KitchenService, public dialog: MatDialog, private snackBar: MatSnackBar){}
  public IngredientTypeMapping: { [key: string]: IngredientType } = {
      'POVRĆE I VOĆE': IngredientType.VEGETABLES_FRUITS,
      'ŽITARICE': IngredientType.GRAIN,
      'MLEČNI PROIZVODI I JAJA': IngredientType.MILK_PRODUCTS_EGGS,
      'MESO': IngredientType.MEAT,
      'MASTI I ULJA': IngredientType.FAT,
      'OSTALO': IngredientType.OTHER
    };
  public IngredientTypes: [string, IngredientType][] = Object.entries(this.IngredientTypeMapping);

  ngOnInit(): void {
    this.loadIngredients();
    this.searchControl.valueChanges.subscribe(value => this.searchIngredients(value));
  }

  loadIngredients(): void {
    this.service.getAllIngredientsPaged().subscribe({
      next: (result: any) => {
        this.filteredIngredients = result.results;
        this.ingredients = result.results;
      },
      error: () => {
        //add some toast
      }
    })
  }
  getIngredientsByType(type: IngredientType): Ingredient[] {
    return this.ingredients.filter(ingredient => ingredient.type === type);
  }
  searchIngredients(query: string): void {
    const lowerCaseQuery = query.toLowerCase();
    this.filteredIngredients = this.ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(lowerCaseQuery));
  }
  addIngredient(): void {
    const dialogRef = this.dialog.open(IngredientModalComponent, {
      width: '450px',
      height: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadIngredients();
        console.log('The dialog was closed', result);
      }
    });
  }
  updateIngredient(ingredient: Ingredient): void {
    const dialogRef = this.dialog.open(IngredientModalComponent, {
      width: '450px',
      data: ingredient
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadIngredients();
        console.log('The dialog was closed', result);
      }
    });
  }
  deleteIngredient(ingredient: Ingredient): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',  // Set the width
      height: '150px',  // Set the height
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Da li ste sigurni da želite da obrišete " + ingredient.name + "?"

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.service.deleteIngredient(ingredient.id).subscribe({
          next: (result: any) => {
            this.loadIngredients();
          },
          error: (err) => {
            this.snackBar.open('Namirnica je povezana sa jelom, nije je moguće obrisati', 'OK', {
              duration: 3000, 
              verticalPosition: 'top',
              panelClass: ['mat-warn'] 
            });
            this.dialogRef = undefined;
          }
        })
      }
      this.dialogRef = undefined;
    });
  }
}
