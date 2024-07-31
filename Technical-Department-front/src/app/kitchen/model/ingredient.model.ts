import { MeasurementUnit } from './measurementUnit.model';

export interface Ingredient {
  id: number;
  name: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  sugar: number;
  type: IngredientType;
  unitId: number;
  unit: MeasurementUnit;
}
export enum IngredientType {
    FAT,
    VEGETABLES_FRUITS,
    GRAIN,
    MILK_PRODUCTS_EGGS,
    MEAT,
    OTHER
  }