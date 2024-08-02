import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { DishType, Meal } from '../model/meal.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { KitchenService } from '../kitchen.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-meal-dialog',
  templateUrl: './edit-meal-dialog.component.html',
  styleUrls: ['./edit-meal-dialog.component.css']
})
export class EditMealDialogComponent implements OnInit {

  filteredOptions: Observable<Meal[]> | undefined;
  formControl: FormControl = new FormControl();
  currentMeals: Meal[] = [];
  canConfirm : boolean = false;

  constructor(
    private service: KitchenService,
    public dialogRef: MatDialogRef<EditMealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mealOffer: MealOffer }
  ) {}

  ngOnInit(): void {
    this.getCurrentMeals();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  displayName(meal: Meal): string {
    return meal ? meal.name : '';
  }

  getCurrentMeals(): void {
    this.service.getMeals().subscribe({
      next: (result: Meal[]) => {
        const allMeals = result;
        switch (this.data.mealOffer.type) {
          case MealType.BREAKFAST:
            this.currentMeals = allMeals.filter(m => m.types.includes(DishType.BREAKFAST));
            break;
          case MealType.MORNING_SNACK:      
          case MealType.DINNER_SNACK:
            this.currentMeals = allMeals.filter(m => m.types.includes(DishType.SNACK));
            break;
          case MealType.LUNCH:
            this.currentMeals = allMeals.filter(m => m.types.includes(DishType.LUNCH));
            break;
          case MealType.DINNER:
            this.currentMeals = allMeals.filter(m => m.types.includes(DishType.DINNER));
            break;
          case MealType.LUNCH_SALAD:
          case MealType.DINNER_SALAD:
            this.currentMeals = allMeals.filter(m => m.types.includes(DishType.SALAD));
            break;
          default:
            this.currentMeals = allMeals;
        }

        const selectedMeal = this.currentMeals.find(meal => meal.id === this.data.mealOffer.mealId);
        this.formControl.setValue(selectedMeal);
        this.initializeFormControl();
      },
      error: () => { }
    });
  }

  private _filter(value: any): Meal[] {
    let filterValue: string;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value.name.toLowerCase();
    }
    
    return this.currentMeals.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  

  initializeFormControl(): void {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  getConsumerTypeName(consumerType: ConsumerType): string {
    return ConsumerTypeLabels[consumerType] || "Unknown Consumer Type";
  }

  getMealTypeName(mealType: MealType): string {
    return MealTypeLabels[mealType] || "Unknown Meal Type";
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.formControl) {
      const selectedMeal = this.currentMeals.find(m => m === this.formControl.value);
      if (selectedMeal) {
        const newMealOffer: MealOffer = {
          consumerType: this.data.mealOffer.consumerType,
          mealName: selectedMeal.name!,
          mealId: selectedMeal.id!,
          type: this.data.mealOffer.type,
          consumerQuantity: 0,
          dailyMenuId: this.data.mealOffer.dailyMenuId
        };
        this.service.addMealOffer(newMealOffer).subscribe({
          next: () => {
            console.log("Added/changed meal offer");   
            this.dialogRef.close(newMealOffer);       
          },
          error: (error) => {
            console.error('Error adding meal offer: ', error);
            if (error.error && error.error.errors) {
              console.log('Validation errors:', error.error.errors);
            }
          }
        });
      }
    }
  }

  
}
