import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsumerType, ConsumerTypeLabels, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KitchenService } from '../kitchen.service';
import { ConsumerQuantity } from '../model/consumer-quantity.model';

@Component({
  selector: 'app-consumer-quantity',
  templateUrl: './consumer-quantity.component.html',
  styleUrls: ['./consumer-quantity.component.css']
})
export class ConsumerQuantityComponent {
  selectedMealTabIndex: number = 0;

  mealFormGroup: FormGroup = new FormGroup({});
  canConfirm: boolean = false;

  selectedMealType: MealType = MealType.BREAKFAST;
  mealTypes = Object.keys(MealType)
    .filter(key => !isNaN(Number(MealType[key as keyof typeof MealType])))
    .map(key => ({
      name: MealTypeLabels[MealType[key as keyof typeof MealType] as keyof typeof MealTypeLabels],
      value: MealType[key as keyof typeof MealType]
    })).filter(mealType => ![MealType.LUNCH_SALAD, MealType.DINNER_SALAD].includes(mealType.value)); // Exclude salad types

  consumerTypes = Object.keys(ConsumerType)
    .filter(key => !isNaN(Number(ConsumerType[key as keyof typeof ConsumerType])))
    .map(key => ({
      name: ConsumerTypeLabels[ConsumerType[key as keyof typeof ConsumerType] as keyof typeof ConsumerTypeLabels],
      value: ConsumerType[key as keyof typeof ConsumerType]
    }));

  constructor(private service: KitchenService, private snackBar: MatSnackBar, private router: Router, private cdr: ChangeDetectorRef) {
    this.initializeEmptyFormGroup();
  }

  ngOnInit() {}

  initializeEmptyFormGroup() {
    const positiveIntegerPattern = '^[0-9]+$';
    this.mealTypes.forEach(mealType => {
      this.consumerTypes.forEach(consumerType => {
        const controlName = this.getFormControlName(mealType.value, consumerType.value);
        this.mealFormGroup.addControl(controlName, new FormControl('', [
          Validators.required,
          Validators.pattern(positiveIntegerPattern)
        ]));
      });
    });

    this.mealFormGroup.statusChanges.subscribe(status => {
      this.canConfirm = status === 'VALID';
    });
  }

  getFormControlName(mealType: MealType, consumerType: ConsumerType): string {
    return `${mealType}-${consumerType}`;
  }

  showNextTab(): void {
    if (this.selectedMealTabIndex < 4) {
      this.selectedMealTabIndex = this.selectedMealTabIndex + 1;
    } else {
      this.selectedMealTabIndex = 0;
    }
  }

  isMealValid(mealType: MealType): boolean {
    let isValid = true;
    this.consumerTypes.forEach(consumerType => {
      const controlName = this.getFormControlName(mealType, consumerType.value);
      const control = this.mealFormGroup.get(controlName);
      if (control && control.invalid) {
        isValid = false;
      }
    });
    return isValid;
  }

  onSelectedMealTabChange(event: any): void {
    this.selectedMealType = this.mealTypes[event.index].value;
    console.log("Meal type: " + this.selectedMealType)
    this.selectedMealTabIndex = event.index;
    console.log("Tab index: " + this.selectedMealTabIndex)
  }  

  createConsumerQuantityList(): void {
    if (!this.mealFormGroup.valid) {
      this.snackBar.open('Proverite da li su sve forme validno popunjene.', 'OK', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['mat-warn']
      });
      return;
    } else {
      const consumerQuantities: ConsumerQuantity[] = this.generateConsumerQuantities();
      console.log(consumerQuantities);
      //bind backend method here
      this.snackBar.open('Brojno stanje za sutrasnji dan je uspesno uneto.', 'OK', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['notif-success']
      });
      //this.router.navigate(['/menus']);
    }
  }

  generateConsumerQuantities(): ConsumerQuantity[] {
    const consumerQuantities: ConsumerQuantity[] = [];

    this.mealTypes.forEach(mealType => {
      this.consumerTypes.forEach(consumerType => {
        const controlName = this.getFormControlName(mealType.value, consumerType.value);
        const control = this.mealFormGroup.get(controlName);
        if (control) {
          consumerQuantities.push({
            consumerType: consumerType.value,
            mealType: mealType.value,
            quantity: control.value
          });

          // Add salad types with the same values as their corresponding main meals
          if (mealType.value === MealType.LUNCH) {
            consumerQuantities.push({
              consumerType: consumerType.value,
              mealType: MealType.LUNCH_SALAD,
              quantity: control.value
            });
          }
          if (mealType.value === MealType.DINNER) {
            consumerQuantities.push({
              consumerType: consumerType.value,
              mealType: MealType.DINNER_SALAD,
              quantity: control.value
            });
          }
        }
      });
    });

    return consumerQuantities;
  }
}
