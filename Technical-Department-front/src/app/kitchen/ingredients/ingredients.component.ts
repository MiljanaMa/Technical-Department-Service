import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../kitchen.service';
import { Ingredient, IngredientType } from '../model/ingredient.model';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit{
  public ingredients: Ingredient[] = [];
  constructor(private service: KitchenService){}
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
    this.service.getAllIngredients().subscribe({
      next: (result: any) => {
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
}
