import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private fb: FormBuilder, private service: KitchenService,
     private route: ActivatedRoute, private router: Router,
     private cdr: ChangeDetectorRef) {
    this.mealForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      date: ['', Validators.required],
      types: this.fb.array([]),
      ingredients: this.fb.array([])
    });
    /*this.dishTypes.forEach(type => {
      this.typesFormArray.push(this.fb.group({
        checked: [false],
        name: [type]
      }));
    });*/

  }
/*
  private addCheckboxes() {
    this.dishTypes.forEach(() => this.typesFormArray.push(this.fb.control(false)));
  }
*/
  get typesFormArray() {
    return this.mealForm.controls['types'] as FormArray;
  }

  ngOnInit(): void {

    this.service.getAllIngredients().subscribe({
      next: (result: any) => {

        this.allIngredients = result.results;

        const id = this.route.snapshot.paramMap.get('id');
        if (id !== "null") {
          this.loadMeal(parseInt(id || ''));
        } else {
          //this.addCheckboxes();
          this.initializeIngredients(5);
        }
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
          date: result.standardizationDate,
          code: result.code
        });
      const typesFormArray = this.mealForm.get('types') as FormArray;
      // Clear existing controls
      typesFormArray.clear();

      // Add controls with the appropriate checked state
      this.dishTypes.forEach((type, index) => {
        // Check if the type is in the result's types array
        const isChecked = result.types.includes(index);
        typesFormArray.push(this.fb.control(this.fb.group({
          checked: [isChecked],
          name: [type]
        })));
      });
      // Update existing types controls
      /*const typesFormArray = this.mealForm.get('types') as FormArray;
      result.types.forEach((typeIndex: number) => {
        typesFormArray.at(typeIndex).get('checked')?.setValue(true);
      });*/
      // Trigger change detection
      //this.cdr.detectChanges();

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
      ingredient: [existingIngredient[0], Validators.required],
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
      const id = this.route.snapshot.paramMap.get('id');
      const newMeal: Meal = {
        id: parseInt(id || '0'),
        name: this.mealForm.value.name,
        standardizationDate: standardizedDate,
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
          this.service.updateMeal(newMeal).subscribe({
            next: () => {
              this.router.navigate([`meals`]);
            },
            error: () => {
              // Handle error
            }
          });
        } else {
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
