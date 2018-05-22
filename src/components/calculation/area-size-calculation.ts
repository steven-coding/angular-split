import {IArea} from "../../interface/IArea";
import {IAreaSizeCalculationOptions} from "../../interface/calculation/IAreaSizeCalculationOptions";
import {IAreaSizeCalculation} from "../../interface/calculation/IAreaSizeCalculation";
import {
    IAreaDragAndDropCalculationSource
} from "../../interface/calculation/calculation-sources/IAreaDragAndDropCalculationSource";
import {
    IWindowResizeCalculationSource
} from "../../interface/calculation/calculation-sources/IWindowResizeCalculationSource";

/**
 * Calculation logic for area sizes
 */
export class AreaSizeCalculation implements IAreaSizeCalculation {

    /**
     * Modifies sizes of areas in the list by totalSize
     *
     * @param areas list of areas to be modified
     * @param sourceAreaIndex index of area that triggered modification (will not be modified [a second time])
     * @param totalSize size to be added / subtracted to / from areas within the list
     * @param containerSizePixel size of the container in pixel
     * @param gutterSizePxPerVisibleComponent size of the gutter in pixel per visible component
     * @param direction direction of modification starting from sourceAreaIndex
     * @returns size left, that couldnt be added / subtracted to / from the areas within the list
     */
    private static modifyAreaSizes(
        areas: IArea[],
        sourceAreaIndex: number,
        totalSize: number,
        containerSizePixel: number,
        gutterSizePxPerVisibleComponent: number,
        direction: 'left' | 'right'
    ): number {

        let result: number = totalSize;

        // if there is nothing to modify (-> totalSize is zero)
        if (result === 0) {

            // there's nothing to do
            return result;
        }

        // if the area-list is empty
        if ( !areas || areas.length === 0) {

            // there's nothing to do
            return result;
        }

        // if there is only 1 area in the area list
        if (areas.length <= 1) {

            // there's nothing to do, because the list contains the source area only
            return result;
        }

        // modifying direction = to the right
        if (direction === 'right') {

            // sourceArea is rightmost area
            if (sourceAreaIndex + 1 === areas.length) {

                // there's nothing to do
                return result;
            }

            // iterate the area-list to the right (starting with the component next to sourceAreaIndex)
            for (let i = sourceAreaIndex + 1; i < areas.length; i++) {

                // area at current index
                const currentArea = areas[i];

                // left space to be subtracted
                result = AreaSizeCalculation.modifyAreaSize(
                    currentArea,
                    result,
                    containerSizePixel,
                    gutterSizePxPerVisibleComponent);

                // if there is no space left to modify
                if (result === 0) {

                    // stop iterating
                    break;
                }
            }

        } else if (direction === 'left') { // modifying direction = to the left

            // sourceArea is leftmost area
            if (sourceAreaIndex  === 0) {

                // there's nothing to do
                return result;
            }

            // iterate the area-list to the left (starting with the component next to sourceAreaIndex)
            for (let i = sourceAreaIndex - 1; i >= 0; i--) {

                // area at current index
                const currentArea = areas[i];

                // left space to be subtracted
                result = AreaSizeCalculation.modifyAreaSize(
                    currentArea,
                    result,
                    containerSizePixel,
                    gutterSizePxPerVisibleComponent
                );

                // if there is no space left to modify
                if (result === 0) {

                    // stop iterating
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Modifies size of the area by given size
     *
     * @param area Area to be modified
     * @param sizeToBeModified Size to be added / subtracted to / from the area
     * @param containerSize Size of the container
     * @param gutterSizePxPerVisibleComponent gutter size in px per visible component
     *
     * @returns left size that couldn't be added / subtracted to / from
     *  the area (through min / max restrictions)
     */
    private static modifyAreaSize(
        area: IArea,
        sizeToBeModified: number,
        containerSize: number,
        gutterSizePxPerVisibleComponent: number
    ): number {

        // size left to be modified
        let result: number = sizeToBeModified;

        // is current action a subtraction
        const isSubtract: boolean = sizeToBeModified < 0;

        // there's size to be taken away (subtraction
        if (isSubtract) {

            // adding size taken away from the area
            result += this.subtractSizeFromArea(
                area,
                Math.abs(sizeToBeModified),
                containerSize,
                gutterSizePxPerVisibleComponent);

        }

        return result;
    }

    /**
     * Subtracts size of the area by given size
     *
     * @param area Area to be subtracted it's size
     * @param sizeToBeSubtracted Size to be subtracted from the area
     * @param containerSize Size of the container
     * @param gutterSizePxPerVisibleComponent size of the gutter in px per visible component
     * @returns subtracted size that was subtracted
     */
    private static subtractSizeFromArea(
        area: IArea,
        sizeToBeSubtracted: number,
        containerSize: number,
        gutterSizePxPerVisibleComponent: number): number {

        // size that was subtracted
        let result: number = 0;

        // if the areas size is already 0
        if (area.size === 0) {

            // there's nothing to do
            return result;
        }

        // maximum size to be taken away from the area
        let maxSizeToBeTakenAway = area.size;

        // area has a minimum pixel restriction
        if (area.minSizePx) {

            // minimum size of area (in pcnt of container size)
            const minSizeInPcntOfCurrentContainer =
                Math.ceil(area.minSizePx + gutterSizePxPerVisibleComponent) / containerSize;

            // maximum size to be taken away from area = current-size - min-size
            maxSizeToBeTakenAway = area.size - minSizeInPcntOfCurrentContainer;
        }

        // if there is no size available to be taken away
        if (maxSizeToBeTakenAway <= 0) {

            // there's nothing to do
            return result;
        }

        // size to be actually taken away from the area
        let sizeToBeTakenAway = sizeToBeSubtracted;

        // if the size to be taken away is > than the max size that can be taken away
        if (sizeToBeTakenAway > maxSizeToBeTakenAway) {

            // size to be taken away = max
            sizeToBeTakenAway = maxSizeToBeTakenAway;
        }

        // subtract size from current area's size
        area.size -= sizeToBeTakenAway;

        // set the result to the size taken away;
        result = sizeToBeTakenAway;

        // return what was actually taken away from the area
        return result;
    }

    /**
     * Calculates area sizes according to given IAreaSizeCalculationOptions
     */
    public calculate(opts: IAreaSizeCalculationOptions): void {
        // if calculate was triggered by a drag-and-drop action
        if (opts.calculationSource
            && (opts.calculationSource as IAreaDragAndDropCalculationSource).isDragAndDrop) {
            // handle dragging
            this.handleDragAndDrop(opts);
        } else if (opts.calculationSource
            && (opts.calculationSource as IWindowResizeCalculationSource).isWindowResize) {
            // handle window-resize
            this.handleWindowResize(opts);
        } else {
            // handle normal layout calculations
            this.handleNormalLayout(opts);
        }
    }

    /**
     * Calculates area sizes when gutters are dragged
     * (according to given AreaDragAndDrop inside IAreaSizeCalculationOptions)
     */
    protected handleDragAndDrop(opts: IAreaSizeCalculationOptions) {

        // area-drag-and-drop object inside calculationSource
        const areaDragAndDrop: IAreaDragAndDropCalculationSource =
            opts.calculationSource as IAreaDragAndDropCalculationSource;

        // put dragged areas from drag-and-drop into a 2 element list
        const draggedAreas: IArea[] = [areaDragAndDrop.areaA, areaDragAndDrop.areaB];

        // calculate complete size in px of both dragged areas
        const draggedAreasSizePx = (areaDragAndDrop.areaA.size + areaDragAndDrop.areaB.size)
            * (opts.containerSizePx ? opts.containerSizePx : 0);

        // check & fix min sizes of dragged areas
        this.checkAndFixMinSizePxAreas({

            // use complete size in px of both dragged areas as containerSizePx
            containerSizePx: draggedAreasSizePx,

            // use dragged areas as list of displayed areas
            displayedAreas: draggedAreas,

            // copy gutter size of original options object, because it's the same for dragging areas
            gutterSizePx: opts.gutterSizePx
        });
    }

    /**
     * Calculates area sizes when the window:resize-event was triggered
     */
    protected handleWindowResize(opts: IAreaSizeCalculationOptions) {
        return this.checkAndFixMinSizePxAreas(opts);
    }

    /**
     * Calculates area sizes for normal layouting (first display, area-list changes, ...)
     */
    protected handleNormalLayout(opts: IAreaSizeCalculationOptions) {
        return this.checkAndFixMinSizePxAreas(opts);
    }

    /**
     * Checks and fixes <split-area>-Components that have minSizePx configured
     *
     * @throws E-00001 - area sizes could not be calculated fixing minSizePx
     */
    private checkAndFixMinSizePxAreas(opts: IAreaSizeCalculationOptions): void {

        // if we have one or zero displayed area(s)
        if (opts.displayedAreas.length <= 1) {

            // there is nothing to check and fix
            return;
        }

        // size of the container in pixel (= available space in px)
        const containerSizePixel: number = opts.containerSizePx ? opts.containerSizePx : 0;

        // sum percent of all areas (100% or less?)
        let percentOfAllAreas: number = 0;

        // iterate all displayed areas
        opts.displayedAreas.forEach((area) => {

            // sum percent-size of each area
            percentOfAllAreas += area.size ? area.size : 0;
        });

        // areas with a size > 0
        const displayedAreasWithSizeGreaterZero = opts.displayedAreas.filter((a) => a.size !== 0);

        // total size of all gutters in px
        const totalGutterSizePx = (opts.displayedAreas.length - 1) * (opts.gutterSizePx ? opts.gutterSizePx : 0);

        // size of the gutter in px per component
        const gutterSizePxPerVisibleComponent =
            displayedAreasWithSizeGreaterZero.length > 1
                ? totalGutterSizePx / displayedAreasWithSizeGreaterZero.length
                : totalGutterSizePx;

        // iterate all displayed areas (with size > 0)
        displayedAreasWithSizeGreaterZero.forEach((area, index) => {

            // if the (calculated) area size in pixels is smaller than its configured minSize
            if (area.size * containerSizePixel <
                Math.ceil(area.minSizePx as number + gutterSizePxPerVisibleComponent)) {

                // new size of the current area (-> min size in percent) =
                //      it's configured min size in pixels / container size in pixels
                const newAreaSize =
                    Math.ceil(area.minSizePx as number + gutterSizePxPerVisibleComponent) / containerSizePixel;

                // space that needs to be taken away from other areas
                const diff = area.size - newAreaSize;

                // current area size = size respecting the minimum pixel size
                area.size = newAreaSize;

                const diffAfterCheckingRightSideComponents =
                    AreaSizeCalculation.modifyAreaSizes(
                        displayedAreasWithSizeGreaterZero,
                        index,
                        diff,
                        containerSizePixel,
                        gutterSizePxPerVisibleComponent,
                        'right'
                    );

                // if there is still some space to be modified left after checking right side components
                if (diffAfterCheckingRightSideComponents !== 0) {
                    const diffAfterCheckingLeftSideComponents =
                        AreaSizeCalculation.modifyAreaSizes(
                            displayedAreasWithSizeGreaterZero,
                            index,
                            diffAfterCheckingRightSideComponents,
                            containerSizePixel,
                            gutterSizePxPerVisibleComponent,
                            'left'
                        );

                    // if there is still space left after checking all components
                    if (diffAfterCheckingLeftSideComponents !== 0) {

                        // throw an error
                        throw new Error("E-00001");
                    }
                }
            }
        });
    }
}
