import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementUnit } from '../model/measurementUnit.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ingredient, IngredientType } from '../model/ingredient.model';
import { KitchenService } from '../kitchen.service';

@Component({
  selector: 'app-ingredient-modal',
  templateUrl: './ingredient-modal.component.html',
  styleUrls: ['./ingredient-modal.component.css']
})
export class IngredientModalComponent implements OnInit {
  ingredientForm: FormGroup;
  measurementUnits: MeasurementUnit[] = [];

  public IngredientTypeMapping: { [key: string]: IngredientType } = {
    'POVRĆE I VOĆE': IngredientType.VEGETABLES_FRUITS,
    'ŽITARICE': IngredientType.GRAIN,
    'MLEČNI PROIZVODI I JAJA': IngredientType.MILK_PRODUCTS_EGGS,
    'MESO': IngredientType.MEAT,
    'MASTI I ULJA': IngredientType.FAT,
    'OSTALO': IngredientType.OTHER
  };
  public IngredientTypes: [string, IngredientType][] = Object.entries(this.IngredientTypeMapping);
  
  constructor(private service: KitchenService,
    public dialogRef: MatDialogRef<IngredientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ingredient,
    private fb: FormBuilder
  ) {
    this.ingredientForm = this.fb.group({
      id: [data?.id || 0],
      name: [data?.name || '', Validators.required],
      calories: [data?.calories || 0, [Validators.required, Validators.min(0)]],
      proteins: [data?.proteins || 0, [Validators.required, Validators.min(0)]],
      carbohydrates: [data?.carbohydrates || 0, [Validators.required, Validators.min(0)]],
      fats: [data?.fats || 0, [Validators.required, Validators.min(0)]],
      sugar: [data?.sugar || 0, [Validators.required, Validators.min(0)]],
      type: [data?.type || '', Validators.required],
      unit: [data?.unit || '', Validators.required]
    });
  }
  ngOnInit(): void {
    this.service.getAllMeasurementUnits().subscribe({
      next: (result: any) => {
        this.measurementUnits = result.results;
      },
      error: () => {
        //add some toast
      }
    })
  }
  onSave(): void {
    if (this.ingredientForm.valid) {
      const newIngredient: Ingredient = this.ingredientForm.value;
      newIngredient.unitId = newIngredient.unit.id;
      this.service.createIngredient(newIngredient).subscribe({
        next: (result: any) => {
          this.dialogRef.close(this.ingredientForm.value);
        },
        error: () => {
          //add some toast
        }
      })
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
