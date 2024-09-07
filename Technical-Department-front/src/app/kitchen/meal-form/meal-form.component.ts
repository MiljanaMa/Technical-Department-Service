import { Component, OnInit } from '@angular/core';
import { DishType, IngredientQuantity, Meal } from '../model/meal.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { KitchenService } from '../kitchen.service';
import { Ingredient } from '../model/ingredient.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit {
  public meal: Meal | undefined;
  public mealForm: FormGroup;
  public allIngredients: Ingredient[] = [];
  ingredientFilteredOptions: Observable<Ingredient[]>[] = [];
  dishTypes = ['DORUČAK', 'RUČAK', 'VEČERA', 'SALATA', 'UŽINA'];
  public dishTypeMapping: { [key: string]: DishType } = {
    'DORUČAK': DishType.BREAKFAST,
    'RUČAK': DishType.LUNCH,
    'VEČERA': DishType.DINNER,
    'SALATA': DishType.SALAD,
    'UŽINA': DishType.SNACK
  };

  constructor(private fb: FormBuilder, private service: KitchenService, private route: ActivatedRoute, 
              private router: Router, private snackBar: MatSnackBar) {
    this.mealForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      date: ['', Validators.required],
      isBreadIncluded: [],
      types: this.fb.array([]),
      ingredients: this.fb.array([])
    });
    //this.initializeIngredients(5);

  }

  private addCheckboxes() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === "null")
      this.dishTypes.forEach(() => this.types.push(new FormControl(false)));
    else {
      this.dishTypes.forEach((type, index) => {
        const isChecked = this.meal?.types.includes(index)
        this.types.push(new FormControl(isChecked))
      });
    }
  }

  get types() {
    return this.mealForm.controls['types'] as FormArray;
  }

  ngOnInit(): void {
    this.service.getAllIngredientsPaged().subscribe({
      next: (result: any) => {

        this.allIngredients = result.results;

        const id = this.route.snapshot.paramMap.get('id');
        if (id !== "null") {
          this.loadMeal(parseInt(id || ''));
        } else {
          this.addCheckboxes();
          this.initializeIngredients(5);
        }
        this.initializeIngredientFilteredOptions();
      },
      error: () => {
        // Handle error
      }
    });
  }
  validateIngredient(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true }; 
    return this.isString(control.value) ? { invalidMeal: true } : null; 
  }
  private isString(variable: any) {
    return typeof variable === "string";
  }

  loadMeal(id: number): void {
    this.service.getMeal(id).subscribe({
      next: (result: Meal) => {
        this.meal = result;
        this.mealForm.patchValue({
          name: result.name,
          date: result.standardizationDate,
          code: result.code,
          isBreadIncluded: result.isBreadIncluded
        });
        this.addCheckboxes();
        result.ingredients.forEach((ingredient: any) => {
          this.addExistingIngredient(ingredient);
        });
      },
      error: () => {
        // Handle error
      }
    });
  }

  addExistingIngredient(iq: IngredientQuantity): void {
    var existingIngredient = this.allIngredients.filter(ingredient => ingredient.id === iq.ingredientId);
    const ingredientGroup = this.fb.group({
      ingredient: [existingIngredient[0], [this.validateIngredient.bind(this)]],
      quantity: [iq.quantity, Validators.required]
    });

    this.ingredients.push(ingredientGroup);
    this.setupIngredientAutocomplete(ingredientGroup, this.ingredients.length - 1);
  }

  get ingredients(): FormArray {
    return this.mealForm.get('ingredients') as FormArray;
  }

  addNewIngredient(): void {
    const ingredientGroup = this.fb.group({
      ingredient: ['', [this.validateIngredient.bind(this)]],
      quantity: [null, [Validators.required,  Validators.pattern(/^(?!0(\.0+)?$)\d+(\.\d+)?$/)]]
    });
    this.ingredients.push(ingredientGroup);
    this.setupIngredientAutocomplete(ingredientGroup, this.ingredients.length - 1);
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
    this.ingredientFilteredOptions.splice(index, 1);
  }

  onSubmit(): void {
    if (this.mealForm.valid) {

      let dateTime = new Date(this.mealForm.value.date);
      let standardizedDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
      const id = this.route.snapshot.paramMap.get('id');
      const meal: Meal = {
        id: 0,
        name: this.mealForm.value.name,
        standardizationDate: standardizedDate,
        isBreadIncluded: this.mealForm.value.isBreadIncluded,
        code: this.mealForm.value.code,
        calories: 0.0,
        types: this.mealForm.value.types
          .map((checked: boolean, i: number) => checked ? this.dishTypeMapping[this.dishTypes[i]] : null)
          .filter((v: DishType | null) => v !== null),
        ingredients: this.mealForm.value.ingredients.map((i: any) => ({
          ingredientId: i.ingredient.id,
          ingredientName: i.ingredient.name,
          quantity: i.quantity,
          unitShortName: ''
        }))
      };

      if (id !== "null") {
        meal.id = parseInt(id || '0')
        this.service.updateMeal(meal).subscribe({
          next: () => {
            this.router.navigate([`meals`]);
          },
          error: () => {
            // Handle error
          }
        });
      } else {
        this.service.createMeal(meal).subscribe({
          next: () => {
            this.router.navigate([`meals`]);
          },
          error: (error: any) => {
            console.log(error)
            // Handle error
          }
        });
      }
    }else{
      this.snackBar.open('Proverite da li su sva polja forme validno popunjene.', 'OK', {
        duration: 3000, 
        verticalPosition: 'top',
        panelClass: ['mat-warn'] 
      });
    }
  }

  initializeIngredients(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addNewIngredient();
    }
  }

  setupIngredientAutocomplete(formGroup: FormGroup, index: number): void {
    const nameControl = formGroup.get('ingredient') as FormControl;

    if (nameControl) {
      this.ingredientFilteredOptions[index] = nameControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterIngredients(value))
      );
    }
  }

  filterIngredients(value: string): Ingredient[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.allIngredients.filter(ingredient => ingredient.name.toLowerCase().includes(filterValue));
    }
    return this.allIngredients
  }

  displayName(option: Ingredient): string {
    return option ? option.name + " (" + option.unit.shortName + ")" : '';
  }

  private initializeIngredientFilteredOptions(): void {
    this.ingredients.controls.forEach((_, index) => {
      this.setupIngredientAutocomplete(this.ingredients.at(index) as FormGroup, index);
    });
  }
}