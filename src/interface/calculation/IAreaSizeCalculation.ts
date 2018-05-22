import {IAreaSizeCalculationOptions} from "./IAreaSizeCalculationOptions";

export interface IAreaSizeCalculation {
    calculate(opts: IAreaSizeCalculationOptions): void;
}