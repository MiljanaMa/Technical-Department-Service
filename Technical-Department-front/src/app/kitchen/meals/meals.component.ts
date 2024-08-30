import { Component, OnInit } from '@angular/core';
import { Meal } from '../model/meal.model';
import { KitchenService } from '../kitchen.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  meals: Meal[] = [];
  filteredMeals: Meal[] = []; 
  searchControl = new FormControl();
  dialogRef: MatDialogRef<ConfirmationDialogComponent> | undefined;
  
  constructor(private service: KitchenService, private router: Router,
              public dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit() {
    this.loadMeals();
    this.searchControl.valueChanges.subscribe(value => this.searchMeals(value));
  }
  loadMeals(): void{
    this.service.getMeals().subscribe({
      next: (result: any) => {
        this.meals = result;
        this.filteredMeals = result;
      },
      error: () => {
        //add some toast
      }
    })
  }
  searchMeals(query: string): void {
    const lowerCaseQuery = query.toLowerCase();
    this.filteredMeals = this.meals.filter(meal =>
      meal.name.toLowerCase().includes(lowerCaseQuery));
  }
  addMeal(): void {
    this.router.navigate([`/meal-form/null`]);
  }
  updateMeal(meal: Meal): void {
    this.router.navigate([`/meal-form/${meal.id}`]);
  }
  deleteMeal(meal: Meal): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',  // Set the width
      height: '250px',  // Set the height
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Da li ste sigurni da želite da obrišete " + meal.name + "?"

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.service.deleteMeal(meal.id || 0).subscribe({
          next: (result: any) => {
            this.loadMeals();
          },
          error: () => {
            this.snackBar.open('Jelo je povezana sa menijem, nije moguće obrisati', 'OK', {
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
