import { Component, Inject, OnInit } from '@angular/core';
import { Ingredient } from '../model/ingredient.model';
import { FormControl } from '@angular/forms';
import { KitchenService } from '../kitchen.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ingredients-modal',
  templateUrl: './ingredients-modal.component.html',
  styleUrls: ['./ingredients-modal.component.css']
})
export class IngredientsModalComponent implements OnInit {
  public ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  searchControl = new FormControl();
  selectedIngredient: Ingredient | undefined;

  constructor(private service: KitchenService, public dialogRef: MatDialogRef<IngredientsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ingredient){}
  
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
  searchIngredients(query: string): void {
    const lowerCaseQuery = query.toLowerCase();
    this.filteredIngredients = this.ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(lowerCaseQuery));
  }
  onIngredientSelect(ingredient: Ingredient) {
    this.dialogRef.close(ingredient);
  }

}
