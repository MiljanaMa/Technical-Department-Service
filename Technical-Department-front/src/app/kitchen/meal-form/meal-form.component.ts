import { Component, OnInit } from '@angular/core';
import { DishType, IngredientQuantity, Meal } from '../model/meal.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KitchenService } from '../kitchen.service';
import { Ingredient } from '../model/ingredient.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, of } from 'rxjs';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private service: KitchenService, private route: ActivatedRoute, private router: Router) {
    this.mealForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      date: ['', Validators.required],
      types: this.fb.array([]),
      ingredients: this.fb.array([])
    });
    this.addCheckboxes();
    this.initializeIngredients(5);
    
  }

  private addCheckboxes() {
    this.dishTypes.forEach(() => this.typesFormArray.push(this.fb.control(false)));
  }

  get typesFormArray() {
    return this.mealForm.controls['types'] as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== "null") {
      this.loadMeal(parseInt(id || ''));
    }
    this.service.getAllIngredients().subscribe({
      next: (result: any) => {
        this.allIngredients = result.results;
        this.initializeIngredientFilteredOptions();
      },
      error: () => {
        // Handle error
      }
    });
  }

  loadMeal(id: number): void {
    this.service.getMeal(id).subscribe({
      next: (result: any) => {
        this.mealForm.patchValue({
          name: result.name,
          date: result.date
        });
        result.ingredients.forEach((ingredient: any) => {
          this.addIngredient(ingredient);
        });
      },
      error: () => {
        // Handle error
      }
    });
  }

  addIngredient(ingredient = { ingredient: '', quantity: 0 }): void {
    const ingredientGroup = this.fb.group({
      ingredient: [ingredient.ingredient, Validators.required],
      quantity: [ingredient.quantity, Validators.required]
    });

    this.ingredients.push(ingredientGroup);
    this.setupIngredientAutocomplete(ingredientGroup, this.ingredients.length - 1);
  }

  get ingredients(): FormArray {
    return this.mealForm.get('ingredients') as FormArray;
  }

  addNewIngredient(): void {
    const ingredientGroup = this.fb.group({
      ingredient: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
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

      const newMeal: Meal = {
        name: this.mealForm.value.name,
        standardizationDate: standardizedDate,
        code: this.mealForm.value.code,
        calories: 0.0,
        types: this.mealForm.value.types
                      .map((checked : boolean, i: number) => checked ? this.dishTypeMapping[this.dishTypes[i]] : null)
                      .filter((v: DishType | null)=> v !== null),
        ingredients: this.mealForm.value.ingredients.map((i: any) => ({
          ingredientId: i.ingredient.id,
          ingredientName: i.ingredient.name,
          quantity: i.quantity,
          unitShortName: ''
        }))
      };
      this.service.createMeal(newMeal).subscribe({
        next: () => {
          this.router.navigate([`meals`]);
        },
        error: () => {
          // Handle error
        }
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
    return option ? option.name : '';
  }

  private initializeIngredientFilteredOptions(): void {
    this.ingredients.controls.forEach((_, index) => {
      this.setupIngredientAutocomplete(this.ingredients.at(index) as FormGroup, index);
    });
  }
  getIngredientUnit(index: number): Observable<string> {
    const selectedIngredientName = this.ingredients.controls[index].get('ingredient')?.value;
    
    if (selectedIngredientName) {
      return this.ingredientFilteredOptions[index].pipe(
        map((options: Ingredient[]) => {
          const ingredient = options.find(opt => opt.name === selectedIngredientName);
          return ingredient ? ingredient.unit.shortName : 'N/A';
        }),
        startWith('N/A') // Default value while waiting for data
      );
    }
    
    return of('N/A');
  }
}
