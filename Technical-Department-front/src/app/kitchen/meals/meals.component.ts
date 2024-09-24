import { Component, OnInit } from '@angular/core';
import { Meal } from '../model/meal.model';
import { KitchenService } from '../kitchen.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MealFormComponent } from '../meal-form/meal-form.component';

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
    const dialogRef = this.dialog.open(MealFormComponent, {
      width: '1020px',
      height: 'auto',
      data: null  
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.loadMeals();  
    });
  }

  updateMeal(meal: Meal): void {
    const dialogRef = this.dialog.open(MealFormComponent, {
      width: '1020px',
      height: 'auto',
      data: meal 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.loadMeals();  
    });
  }
  deleteMeal(meal: Meal): void {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      height: '200px',  
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Da li ste sigurni da želite da obrišete jelo "' + meal.name + '"?'

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
