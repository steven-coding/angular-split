import {IArea} from "../IArea";
import {IAreaDragAndDropCalculationSource} from "./calculation-sources/IAreaDragAndDropCalculationSource";
import {IWindowResizeCalculationSource} from "./calculation-sources/IWindowResizeCalculationSource";

/**
 * Calculation parameters for area-size-calculation
 */
export interface IAreaSizeCalculationOptions {
    displayedAreas: IArea[];
    containerSizePx?: number;
    gutterSizePx?: number;
    calculationSource?: IAreaDragAndDropCalculationSource | IWindowResizeCalculationSource;
}
