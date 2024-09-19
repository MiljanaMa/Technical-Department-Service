import { Component, Inject } from '@angular/core';
import { ConsumerType, ConsumerTypeLabels, MealOffer, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { DishType, Meal } from '../model/meal.model';
import { KitchenService } from '../kitchen.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-edit-calorie-based-menu-modal',
  templateUrl: './edit-calorie-based-menu-modal.component.html',
  styleUrls: ['./edit-calorie-based-menu-modal.component.css']
})
export class EditCalorieBasedMenuModalComponent {
  filteredOptions: Observable<Meal[]> | undefined;
  formControl: FormControl = new FormControl();
  currentMeals: Meal[] = [];
  canConfirm : boolean = false;

  constructor(
    private service: KitchenService,
    public dialogRef: MatDialogRef<EditCalorieBasedMenuModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mealOffer: MealOffer, dayName: string }
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
          calories: selectedMeal.calories,
          type: this.data.mealOffer.type,
          consumerQuantity: 0,
          dailyMenuId: this.data.mealOffer.dailyMenuId
        };
         this.dialogRef.close(newMealOffer);         
      }
    }
}
}