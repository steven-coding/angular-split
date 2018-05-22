import {IArea} from "../../IArea";

/**
 * CalculationSource for dragging a gutter
 */
export interface IAreaDragAndDropCalculationSource {
    /**
     * it's checkable "true" for this kind of calculation-source
     *
     * e.g. options.calculationSource.isDragAndDrop
     */
    isDragAndDrop: boolean;

    /**
     * left side area of dragged gutter
     */
    areaA: IArea;

    /**
     * right side area of dragged gutter
     */
    areaB: IArea;
}