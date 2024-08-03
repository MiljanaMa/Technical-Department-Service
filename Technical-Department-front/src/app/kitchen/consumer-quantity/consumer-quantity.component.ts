import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsumerType, ConsumerTypeLabels, MealType, MealTypeLabels } from '../model/meal-offer.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KitchenService } from '../kitchen.service';
import { ConsumerQuantity } from '../model/consumer-quantity.model';
import { WeeklyMenu } from '../model/weekly-menu.model';
import { IngredientQuantity } from '../model/meal.model';

@Component({
  selector: 'app-consumer-quantity',
  templateUrl: './consumer-quantity.component.html',
  styleUrls: ['./consumer-quantity.component.css']
})
export class ConsumerQuantityComponent {
  selectedMealTabIndex: number = 0;
  currentWeeklyMenu?: WeeklyMenu;

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

  ngOnInit() {
    this.service.getMenu('CURRENT').subscribe({
      next: (result: WeeklyMenu) => {
        this.currentWeeklyMenu = result;
      },
      error: (error: any) => {
        console.log(error)
        // Handle error
      }
    });
  }

  initializeEmptyFormGroup() {
    const positiveIntegerPattern = '^[0-9]+$';
    this.mealTypes.forEach(mealType => {
      this.consumerTypes.forEach(consumerType => {
        if (this.shouldRenderSnackInput(mealType.value, consumerType.value)){
        const controlName = this.getFormControlName(mealType.value, consumerType.value);
        this.mealFormGroup.addControl(controlName, new FormControl('', [
          Validators.required,
          Validators.pattern(positiveIntegerPattern)
        ]));
      }
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowsDayOfWeek = (tomorrow.getDay() === 0 ? 6 : (tomorrow.getDay() - 1));

    const tomorrowsDailyMenu = this.currentWeeklyMenu?.menu?.find(menu => menu.dayOfWeek === tomorrowsDayOfWeek);

    if (tomorrowsDailyMenu === null) {
      console.error("Tomorrow's menu not found");
      return consumerQuantities;
    }

    this.mealTypes.forEach(mealType => {
      this.consumerTypes.forEach(consumerType => {
        const controlName = this.getFormControlName(mealType.value, consumerType.value);
        const control = this.mealFormGroup.get(controlName);
        if (control) {
          const mealOffer = tomorrowsDailyMenu?.menu.find(
            offer => offer.consumerType === consumerType.value &&
              offer.type === mealType.value
          );

          if (mealOffer) {
            mealOffer.consumerQuantity = control.value;
          }

          if (mealType.value === MealType.LUNCH) {
            const mealOffer = tomorrowsDailyMenu?.menu.find(
              offer => offer.consumerType === consumerType.value &&
                offer.type === MealType.LUNCH_SALAD
            );

            if (mealOffer) {
              mealOffer.consumerQuantity = control.value;
            }
          }
          if (mealType.value === MealType.DINNER) {
            const mealOffer = tomorrowsDailyMenu?.menu.find(
              offer => offer.consumerType === consumerType.value &&
                offer.type === MealType.DINNER_SALAD
            );

            if (mealOffer) {
              mealOffer.consumerQuantity = control.value;
            }
          }
        }
      });
    });
    if (this.currentWeeklyMenu != undefined) {
      this.service.updateConsumerQuantities(this.currentWeeklyMenu).subscribe({
        next: (result: IngredientQuantity[]) => {
          var IngredientQuantity: IngredientQuantity[] = result
        },
        error: (error: any) => {
          console.log(error)
          // Handle error
        }
      });
    }

    return consumerQuantities;
  }

  shouldRenderSnackInput(mealType: MealType, consumerType: ConsumerType): boolean {
    const snackEligibleConsumerTypes = [ConsumerType.DIABETIC, ConsumerType.PREGNANT, ConsumerType.CHILDREN_2_4, ConsumerType.CHILDREN_4_14];
    const snackMealTypes = [MealType.MORNING_SNACK, MealType.DINNER_SNACK];
    const otherMealTypes = [MealType.BREAKFAST, MealType.DINNER, MealType.DINNER_SALAD, MealType.LUNCH, MealType.LUNCH_SALAD]
    return  otherMealTypes.includes(mealType) || (snackMealTypes.includes(mealType) && snackEligibleConsumerTypes.includes(consumerType));
  }

  getColumnsClass(mealType: MealType, consumerTypes: any[]): string {
    const snackMealTypes = [MealType.MORNING_SNACK, MealType.DINNER_SNACK];

    if (snackMealTypes.includes(mealType)) {
      return 'form-fields-container one-column';
    } else {
      return 'form-fields-container two-columns';
    }
  }
}
