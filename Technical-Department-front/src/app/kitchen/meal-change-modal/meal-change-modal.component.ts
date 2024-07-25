import { Component, Inject } from '@angular/core';
import { Meal } from '../model/meal.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-meal-change-modal',
  templateUrl: './meal-change-modal.component.html',
  styleUrls: ['./meal-change-modal.component.css']
})
export class MealChangeModalComponent {
  newMeal: Meal | undefined; // Define newMeal if needed

  constructor(
    public dialogRef: MatDialogRef<MealChangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { meal: Meal }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Implement save logic here using this.newMeal
    this.dialogRef.close(this.newMeal); // Example: close with newMeal
  }
}
