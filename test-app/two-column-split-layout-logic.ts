import {MIN_MAX_SIZE_CALCULATION} from "../src/ng-split-areas";
import {IAreaSizeCalculation} from "../src/interface/calculation/IAreaSizeCalculation";
import {IAreaSizeCalculationOptions} from "../src/interface/calculation/IAreaSizeCalculationOptions";
import {IWindowResizeCalculationSource} from "../src/interface/calculation/calculation-sources/IWindowResizeCalculationSource";
import {IArea} from "../src/interface/IArea";

export class TwoColumnSplitLayoutLogic implements IAreaSizeCalculation {

    minMaxSizeCalculationLogic: IAreaSizeCalculation;

    constructor() {
        this.minMaxSizeCalculationLogic = MIN_MAX_SIZE_CALCULATION;
    }

    calculate(opts: IAreaSizeCalculationOptions): void {
        //normal layout || window-resize calculation [= NO DRAG-AND-DROP]
        if(!opts.calculationSource || (opts.calculationSource as IWindowResizeCalculationSource).isWindowResize) {
            this.doLayout(opts);
        }
        this.minMaxSizeCalculationLogic.calculate(opts);
    }


    doLayout(opts: IAreaSizeCalculationOptions): void {
        if(!opts || !opts.displayedAreas || opts.displayedAreas.length != 2)
            return;

        const containerSizePx = opts.containerSizePx as number;
        const gutterSizePx = opts.gutterSizePx as number;
        const displayedAreaCount = opts.displayedAreas ? opts.displayedAreas.length : 0;

        const totalGutterSizePx = gutterSizePx  * (displayedAreaCount - 1);
        const totalAvailableSpacePx = containerSizePx - totalGutterSizePx;

        let availableSpacePx = totalAvailableSpacePx;

        //prio 1 - view as many areas as possible
        opts.displayedAreas.forEach((area: IArea, index: number) => {
            if(area.minSizePx && area.minSizePx <= availableSpacePx) {
                area.size = area.minSizePx / totalAvailableSpacePx;
                availableSpacePx -= area.minSizePx;
            } else {
                area.size = 0;
            }
        });

        //prio 2 - areas grow max from left to right if there is space left
        opts.displayedAreas.forEach((area: IArea, index: number) => {
            //we grow areas only, that are visible (size > 0)
            if(area.size === 0 || availableSpacePx === 0)
                return;

            const currentAreaSizeInPx = area.size * totalAvailableSpacePx;

            if (area.maxSizePx) {
                if(area.maxSizePx - currentAreaSizeInPx >= availableSpacePx) {
                    area.size = (currentAreaSizeInPx + availableSpacePx) / totalAvailableSpacePx;
                    availableSpacePx = 0;
                }
                else if(area.maxSizePx - currentAreaSizeInPx < availableSpacePx) {
                    const additionalPxUsed = area.maxSizePx - currentAreaSizeInPx;
                    area.size = area.maxSizePx / totalAvailableSpacePx;
                    availableSpacePx -= additionalPxUsed;
                }
            }
            else {
                area.size = (currentAreaSizeInPx + availableSpacePx) / totalAvailableSpacePx;
                availableSpacePx = 0;
            }


        });

        //if there is still some space left, put it on the first area
        if(availableSpacePx > 0) {
            opts.displayedAreas[0].size += availableSpacePx / totalAvailableSpacePx;
            availableSpacePx = 0;
        }
    }
}