(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/Subject'), require('rxjs/add/operator/debounceTime')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/Subject', 'rxjs/add/operator/debounceTime'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.angularSplit = {}),global.ng.core,global.ng.common,global.Rx));
}(this, (function (exports,core,common,Subject) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Calculation logic for area sizes
 */
var AreaSizeCalculation = (function () {
    function AreaSizeCalculation() {
    }
    /**
     * Modifies sizes of areas in the list by totalSize
     *
     * @param {?} areas list of areas to be modified
     * @param {?} sourceAreaIndex index of area that triggered modification (will not be modified [a second time])
     * @param {?} totalSize size to be added / subtracted to / from areas within the list
     * @param {?} containerSizePixel size of the container in pixel
     * @param {?} gutterSizePxPerVisibleComponent size of the gutter in pixel per visible component
     * @param {?} direction direction of modification starting from sourceAreaIndex
     * @return {?} size left, that couldnt be added / subtracted to / from the areas within the list
     */
    AreaSizeCalculation.modifyAreaSizes = /**
     * Modifies sizes of areas in the list by totalSize
     *
     * @param {?} areas list of areas to be modified
     * @param {?} sourceAreaIndex index of area that triggered modification (will not be modified [a second time])
     * @param {?} totalSize size to be added / subtracted to / from areas within the list
     * @param {?} containerSizePixel size of the container in pixel
     * @param {?} gutterSizePxPerVisibleComponent size of the gutter in pixel per visible component
     * @param {?} direction direction of modification starting from sourceAreaIndex
     * @return {?} size left, that couldnt be added / subtracted to / from the areas within the list
     */
    function (areas, sourceAreaIndex, totalSize, containerSizePixel, gutterSizePxPerVisibleComponent, direction) {
        var /** @type {?} */ result = totalSize;
        // if there is nothing to modify (-> totalSize is zero)
        if (result === 0) {
            // there's nothing to do
            return result;
        }
        // if the area-list is empty
        if (!areas || areas.length === 0) {
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
            for (var /** @type {?} */ i = sourceAreaIndex + 1; i < areas.length; i++) {
                // area at current index
                var /** @type {?} */ currentArea = areas[i];
                // left space to be subtracted
                result = AreaSizeCalculation.modifyAreaSize(currentArea, result, containerSizePixel, gutterSizePxPerVisibleComponent);
                // if there is no space left to modify
                if (result === 0) {
                    // stop iterating
                    break;
                }
            }
        }
        else if (direction === 'left') {
            // modifying direction = to the left
            // sourceArea is leftmost area
            if (sourceAreaIndex === 0) {
                // there's nothing to do
                return result;
            }
            // iterate the area-list to the left (starting with the component next to sourceAreaIndex)
            for (var /** @type {?} */ i = sourceAreaIndex - 1; i >= 0; i--) {
                // area at current index
                var /** @type {?} */ currentArea = areas[i];
                // left space to be subtracted
                result = AreaSizeCalculation.modifyAreaSize(currentArea, result, containerSizePixel, gutterSizePxPerVisibleComponent);
                // if there is no space left to modify
                if (result === 0) {
                    // stop iterating
                    break;
                }
            }
        }
        return result;
    };
    /**
     * Modifies size of the area by given size
     *
     * @param {?} area Area to be modified
     * @param {?} sizeToBeModified Size to be added / subtracted to / from the area
     * @param {?} containerSize Size of the container
     * @param {?} gutterSizePxPerVisibleComponent gutter size in px per visible component
     *
     * @return {?} left size that couldn't be added / subtracted to / from
     *  the area (through min / max restrictions)
     */
    AreaSizeCalculation.modifyAreaSize = /**
     * Modifies size of the area by given size
     *
     * @param {?} area Area to be modified
     * @param {?} sizeToBeModified Size to be added / subtracted to / from the area
     * @param {?} containerSize Size of the container
     * @param {?} gutterSizePxPerVisibleComponent gutter size in px per visible component
     *
     * @return {?} left size that couldn't be added / subtracted to / from
     *  the area (through min / max restrictions)
     */
    function (area, sizeToBeModified, containerSize, gutterSizePxPerVisibleComponent) {
        // size left to be modified
        var /** @type {?} */ result = sizeToBeModified;
        // is current action a subtraction
        var /** @type {?} */ isSubtract = sizeToBeModified < 0;
        // there's size to be taken away (subtraction
        if (isSubtract) {
            // adding size taken away from the area
            result += this.subtractSizeFromArea(area, Math.abs(sizeToBeModified), containerSize, gutterSizePxPerVisibleComponent);
        }
        return result;
    };
    /**
     * Subtracts size of the area by given size
     *
     * @param {?} area Area to be subtracted it's size
     * @param {?} sizeToBeSubtracted Size to be subtracted from the area
     * @param {?} containerSize Size of the container
     * @param {?} gutterSizePxPerVisibleComponent size of the gutter in px per visible component
     * @return {?} subtracted size that was subtracted
     */
    AreaSizeCalculation.subtractSizeFromArea = /**
     * Subtracts size of the area by given size
     *
     * @param {?} area Area to be subtracted it's size
     * @param {?} sizeToBeSubtracted Size to be subtracted from the area
     * @param {?} containerSize Size of the container
     * @param {?} gutterSizePxPerVisibleComponent size of the gutter in px per visible component
     * @return {?} subtracted size that was subtracted
     */
    function (area, sizeToBeSubtracted, containerSize, gutterSizePxPerVisibleComponent) {
        // size that was subtracted
        var /** @type {?} */ result = 0;
        // if the areas size is already 0
        if (area.size === 0) {
            // there's nothing to do
            return result;
        }
        // maximum size to be taken away from the area
        var /** @type {?} */ maxSizeToBeTakenAway = area.size;
        // area has a minimum pixel restriction
        if (area.minSizePx) {
            // minimum size of area (in pcnt of container size)
            var /** @type {?} */ minSizeInPcntOfCurrentContainer = Math.ceil(area.minSizePx + gutterSizePxPerVisibleComponent) / containerSize;
            // maximum size to be taken away from area = current-size - min-size
            maxSizeToBeTakenAway = area.size - minSizeInPcntOfCurrentContainer;
        }
        // if there is no size available to be taken away
        if (maxSizeToBeTakenAway <= 0) {
            // there's nothing to do
            return result;
        }
        // size to be actually taken away from the area
        var /** @type {?} */ sizeToBeTakenAway = sizeToBeSubtracted;
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
    };
    /**
     * Calculates area sizes according to given IAreaSizeCalculationOptions
     * @param {?} opts
     * @return {?}
     */
    AreaSizeCalculation.prototype.calculate = /**
     * Calculates area sizes according to given IAreaSizeCalculationOptions
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        // if calculate was triggered by a drag-and-drop action
        if (opts.calculationSource
            && (/** @type {?} */ (opts.calculationSource)).isDragAndDrop) {
            // handle dragging
            this.handleDragAndDrop(opts);
        }
        else if (opts.calculationSource
            && (/** @type {?} */ (opts.calculationSource)).isWindowResize) {
            // handle window-resize
            this.handleWindowResize(opts);
        }
        else {
            // handle normal layout calculations
            this.handleNormalLayout(opts);
        }
    };
    /**
     * Calculates area sizes when gutters are dragged
     * (according to given AreaDragAndDrop inside IAreaSizeCalculationOptions)
     */
    /**
     * Calculates area sizes when gutters are dragged
     * (according to given AreaDragAndDrop inside IAreaSizeCalculationOptions)
     * @param {?} opts
     * @return {?}
     */
    AreaSizeCalculation.prototype.handleDragAndDrop = /**
     * Calculates area sizes when gutters are dragged
     * (according to given AreaDragAndDrop inside IAreaSizeCalculationOptions)
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        // area-drag-and-drop object inside calculationSource
        var /** @type {?} */ areaDragAndDrop = /** @type {?} */ (opts.calculationSource);
        // put dragged areas from drag-and-drop into a 2 element list
        var /** @type {?} */ draggedAreas = [areaDragAndDrop.areaA, areaDragAndDrop.areaB];
        // calculate complete size in px of both dragged areas
        var /** @type {?} */ draggedAreasSizePx = (areaDragAndDrop.areaA.size + areaDragAndDrop.areaB.size)
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
    };
    /**
     * Calculates area sizes when the window:resize-event was triggered
     */
    /**
     * Calculates area sizes when the window:resize-event was triggered
     * @param {?} opts
     * @return {?}
     */
    AreaSizeCalculation.prototype.handleWindowResize = /**
     * Calculates area sizes when the window:resize-event was triggered
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        return this.checkAndFixMinSizePxAreas(opts);
    };
    /**
     * Calculates area sizes for normal layouting (first display, area-list changes, ...)
     */
    /**
     * Calculates area sizes for normal layouting (first display, area-list changes, ...)
     * @param {?} opts
     * @return {?}
     */
    AreaSizeCalculation.prototype.handleNormalLayout = /**
     * Calculates area sizes for normal layouting (first display, area-list changes, ...)
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        return this.checkAndFixMinSizePxAreas(opts);
    };
    /**
     * Checks and fixes <split-area>-Components that have minSizePx configured
     *
     * @throws E-00001 - area sizes could not be calculated fixing minSizePx
     * @param {?} opts
     * @return {?}
     */
    AreaSizeCalculation.prototype.checkAndFixMinSizePxAreas = /**
     * Checks and fixes <split-area>-Components that have minSizePx configured
     *
     * @throws E-00001 - area sizes could not be calculated fixing minSizePx
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        // if we have one or zero displayed area(s)
        if (opts.displayedAreas.length <= 1) {
            // there is nothing to check and fix
            return;
        }
        // size of the container in pixel (= available space in px)
        var /** @type {?} */ containerSizePixel = opts.containerSizePx ? opts.containerSizePx : 0;
        // sum percent of all areas (100% or less?)
        opts.displayedAreas.forEach(function (area) {
            // sum percent-size of each area
            
        });
        // areas with a size > 0
        var /** @type {?} */ displayedAreasWithSizeGreaterZero = opts.displayedAreas.filter(function (a) { return a.size !== 0; });
        // total size of all gutters in px
        var /** @type {?} */ totalGutterSizePx = (opts.displayedAreas.length - 1) * (opts.gutterSizePx ? opts.gutterSizePx : 0);
        // size of the gutter in px per component
        var /** @type {?} */ gutterSizePxPerVisibleComponent = displayedAreasWithSizeGreaterZero.length > 1
            ? totalGutterSizePx / displayedAreasWithSizeGreaterZero.length
            : totalGutterSizePx;
        // iterate all displayed areas (with size > 0)
        displayedAreasWithSizeGreaterZero.forEach(function (area, index) {
            // if the (calculated) area size in pixels is smaller than its configured minSize
            if (area.size * containerSizePixel <
                Math.ceil(/** @type {?} */ (area.minSizePx) + gutterSizePxPerVisibleComponent)) {
                // new size of the current area (-> min size in percent) =
                //      it's configured min size in pixels / container size in pixels
                var /** @type {?} */ newAreaSize = Math.ceil(/** @type {?} */ (area.minSizePx) + gutterSizePxPerVisibleComponent) / containerSizePixel;
                // space that needs to be taken away from other areas
                var /** @type {?} */ diff = area.size - newAreaSize;
                // current area size = size respecting the minimum pixel size
                area.size = newAreaSize;
                var /** @type {?} */ diffAfterCheckingRightSideComponents = AreaSizeCalculation.modifyAreaSizes(displayedAreasWithSizeGreaterZero, index, diff, containerSizePixel, gutterSizePxPerVisibleComponent, 'right');
                // if there is still some space to be modified left after checking right side components
                if (diffAfterCheckingRightSideComponents !== 0) {
                    var /** @type {?} */ diffAfterCheckingLeftSideComponents = AreaSizeCalculation.modifyAreaSizes(displayedAreasWithSizeGreaterZero, index, diffAfterCheckingRightSideComponents, containerSizePixel, gutterSizePxPerVisibleComponent, 'left');
                    // if there is still space left after checking all components
                    if (diffAfterCheckingLeftSideComponents !== 0) {
                        // throw an error
                        throw new Error("E-00001");
                    }
                }
            }
        });
    };
    return AreaSizeCalculation;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * angular-split
 *
 * Areas size are set in percentage of the split container.
 * Gutters size are set in pixels.
 *
 * So we set css 'flex-basis' property like this (where 0 <= area.size <= 1):
 *  calc( { area.size * 100 }% - { area.size * nbGutter * gutterSize }px );
 *
 * Examples with 3 visible areas and 2 gutters:
 *
 * |                     10px                   10px                                  |
 * |---------------------[]---------------------[]------------------------------------|
 * |  calc(20% - 4px)          calc(20% - 4px)              calc(60% - 12px)          |
 *
 *
 * |                          10px                        10px                        |
 * |--------------------------[]--------------------------[]--------------------------|
 * |  calc(33.33% - 6.667px)      calc(33.33% - 6.667px)      calc(33.33% - 6.667px)  |
 *
 *
 * |10px                                                  10px                        |
 * |[]----------------------------------------------------[]--------------------------|
 * |0                 calc(66.66% - 13.333px)                  calc(33%% - 6.667px)   |
 *
 *
 *  10px 10px                                                                         |
 * |[][]------------------------------------------------------------------------------|
 * |0 0                               calc(100% - 20px)                               |
 *
 */
var SplitComponent = (function () {
    function SplitComponent(ngZone, elRef, cdRef, renderer) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.renderer = renderer;
        this._direction = 'horizontal';
        this._useTransition = false;
        this._disabled = false;
        this._width = null;
        this._height = null;
        this._gutterSize = 11;
        this._gutterColor = '';
        this._gutterImageH = '';
        this._gutterImageV = '';
        this._dir = 'ltr';
        this.dragStart = new core.EventEmitter(false);
        this.dragProgress = new core.EventEmitter(false);
        this.dragEnd = new core.EventEmitter(false);
        this.gutterClick = new core.EventEmitter(false);
        this.transitionEndInternal = new Subject.Subject();
        this.transitionEnd = (/** @type {?} */ (this.transitionEndInternal.asObservable())).debounceTime(20);
        this.defaultAreaSizeCalculation = new AreaSizeCalculation();
        this.isViewInitialized = false;
        this.isDragging = false;
        this.draggingWithoutMove = false;
        this.currentGutterNum = 0;
        this.displayedAreas = [];
        this.hidedAreas = [];
        this.dragListeners = [];
        this.dragStartValues = {
            sizePixelContainer: 0,
            sizePixelA: 0,
            sizePixelB: 0,
            sizePercentA: 0,
            sizePercentB: 0,
        };
    }
    Object.defineProperty(SplitComponent.prototype, "direction", {
        get: /**
         * @return {?}
         */
        function () {
            return this._direction;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            var _this = this;
            v = (v === 'vertical') ? 'vertical' : 'horizontal';
            this._direction = v;
            this.displayedAreas.concat(this.hidedAreas).forEach(function (area) {
                area.comp.setStyleVisibleAndDir(area.comp.visible, _this.isDragging, _this.direction);
            });
            this.build(false, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "useTransition", {
        get: /**
         * @return {?}
         */
        function () {
            return this._useTransition;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
            this._useTransition = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () {
            return this._disabled;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
            this._disabled = v;
            // Force repaint if modified from TS class (instead of the template)
            this.cdRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "width", {
        get: /**
         * @return {?}
         */
        function () {
            return this._width;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._width = (!isNaN(v) && v > 0) ? v : null;
            this.build(false, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "height", {
        get: /**
         * @return {?}
         */
        function () {
            return this._height;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._height = (!isNaN(v) && v > 0) ? v : null;
            this.build(false, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "gutterSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gutterSize;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._gutterSize = (!isNaN(v) && v > 0) ? v : 11;
            this.build(false, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "gutterColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gutterColor;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._gutterColor = (typeof v === 'string' && v !== '') ? v : '';
            // Force repaint if modified from TS class (instead of the template)
            this.cdRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "gutterImageH", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gutterImageH;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._gutterImageH = (typeof v === 'string' && v !== '') ? v : '';
            // Force repaint if modified from TS class (instead of the template)
            this.cdRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "gutterImageV", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gutterImageV;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._gutterImageV = (typeof v === 'string' && v !== '') ? v : '';
            // Force repaint if modified from TS class (instead of the template)
            this.cdRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "dir", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dir;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (v === 'rtl') ? 'rtl' : 'ltr';
            this._dir = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssFlexdirection", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.direction === 'horizontal') ? 'row' : 'column';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return this.width ? this.width + "px" : '100%';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssHeight", {
        get: /**
         * @return {?}
         */
        function () {
            return this.height ? this.height + "px" : '100%';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssMinwidth", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.direction === 'horizontal') ? this.getNbGutters() * this.gutterSize + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "cssMinheight", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.direction === 'vertical') ? this.getNbGutters() * this.gutterSize + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "areaSizeCalculation", {
        get: /**
         * @return {?}
         */
        function () {
            return this._areaSizeCalculation;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._areaSizeCalculation = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "areaSizeCalculationToBeUsed", {
        get: /**
         * @return {?}
         */
        function () {
            return this.areaSizeCalculation ? this.areaSizeCalculation : this.defaultAreaSizeCalculation;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.addArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        var /** @type {?} */ newArea = {
            comp: comp,
            minSizePx: comp.minSizePx,
            order: 0,
            size: 0
        };
        if (comp.visible === true) {
            this.displayedAreas.push(newArea);
        }
        else {
            this.hidedAreas.push(newArea);
        }
        comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
        this.build(true, true);
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.removeArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        if (this.displayedAreas.some(function (a) { return a.comp === comp; })) {
            var /** @type {?} */ area = /** @type {?} */ (this.displayedAreas.find(function (a) { return a.comp === comp; }));
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            this.build(true, true);
        }
        else if (this.hidedAreas.some(function (a) { return a.comp === comp; })) {
            var /** @type {?} */ area = /** @type {?} */ (this.hidedAreas.find(function (a) { return a.comp === comp; }));
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    };
    /**
     * @param {?} comp
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    SplitComponent.prototype.updateArea = /**
     * @param {?} comp
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    function (comp, resetOrders, resetSizes) {
        // Only refresh if area is displayed (No need to check inside 'hidedAreas')
        var /** @type {?} */ item = this.displayedAreas.find(function (a) { return a.comp === comp; });
        if (item) {
            // use minSizePx from the component
            item.minSizePx = comp.minSizePx;
            this.build(resetOrders, resetSizes);
        }
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.showArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        var /** @type {?} */ area = this.hidedAreas.find(function (a) { return a.comp === comp; });
        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
            var /** @type {?} */ areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            (_a = this.displayedAreas).push.apply(_a, areas);
            this.build(true, true);
        }
        var _a;
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    SplitComponent.prototype.hideArea = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        var /** @type {?} */ area = this.displayedAreas.find(function (a) { return a.comp === comp; });
        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
            var /** @type {?} */ areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            areas.forEach(function (currentArea) {
                currentArea.order = 0;
                currentArea.size = 0;
            });
            (_a = this.hidedAreas).push.apply(_a, areas);
            this.build(true, true);
        }
        var _a;
    };
    Object.defineProperty(SplitComponent.prototype, "containerMinWidth", {
        get: /**
         * Min-Width of the container
         * @return {?}
         */
        function () {
            // if split direction is NOT vertical
            if (this.direction !== "horizontal") {
                // min-width is 0 (unset)
                return 0;
            }
            // return the sum of all area minSizes + gutter sizes
            return this.getMinSizeOfAllDisplayedComponentsPlusGutterSize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitComponent.prototype, "containerMinHeight", {
        get: /**
         * Min-Height of the container
         * @return {?}
         */
        function () {
            // if split direction is NOT vertical
            if (this.direction !== "vertical") {
                // min-height is 0 (unset)
                return 0;
            }
            // return the sum of all area minSizes + gutter sizes
            return this.getMinSizeOfAllDisplayedComponentsPlusGutterSize();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.isViewInitialized = true;
    };
    /**
     * Sum of all area minSizes + gutter sizes
     * @return {?}
     */
    SplitComponent.prototype.getMinSizeOfAllDisplayedComponentsPlusGutterSize = /**
     * Sum of all area minSizes + gutter sizes
     * @return {?}
     */
    function () {
        if (!this.displayedAreas || this.displayedAreas.length === 0) {
            return 0;
        }
        return this.getMinSizeOfAllDisplayedComponents() + (this.gutterSize * (this.displayedAreas.length - 1));
    };
    /**
     * Sum of all area minSizes
     * @return {?}
     */
    SplitComponent.prototype.getMinSizeOfAllDisplayedComponents = /**
     * Sum of all area minSizes
     * @return {?}
     */
    function () {
        if (!this.displayedAreas || this.displayedAreas.length === 0) {
            return 0;
        }
        var /** @type {?} */ result = 0;
        this.displayedAreas.forEach(function (area) {
            if (area.minSizePx) {
                result += area.minSizePx;
            }
        });
        return result;
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.getNbGutters = /**
     * @return {?}
     */
    function () {
        return this.displayedAreas.length - 1;
    };
    /**
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    SplitComponent.prototype.build = /**
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    function (resetOrders, resetSizes) {
        var _this = this;
        this.stopDragging();
        // ¤ AREAS ORDER
        if (resetOrders === true) {
            // If user provided 'order' for each area, use it to sort them.
            if (this.displayedAreas.every(function (a) { return a.comp.order !== null; })) {
                this.displayedAreas.sort(function (a, b) { return (/** @type {?} */ (a.comp.order)) - (/** @type {?} */ (b.comp.order)); });
            }
            // Then set real order with multiples of 2, numbers between will be used by gutters.
            this.displayedAreas.forEach(function (area, i) {
                area.order = i * 2;
                area.comp.setStyleOrder(area.order);
            });
        }
        // ¤ AREAS SIZE PERCENT
        if (resetSizes === true) {
            var /** @type {?} */ totalUserSize = /** @type {?} */ (this.displayedAreas.reduce(function (total, s) { return s.comp.size ? total + s.comp.size : total; }, 0));
            // If user provided 'size' for each area and total == 1, use it.
            if (this.displayedAreas.every(function (a) { return a.comp.size !== null; })
                && totalUserSize > .999
                && totalUserSize < 1.001) {
                this.displayedAreas.forEach(function (area) {
                    area.size = /** @type {?} */ (area.comp.size);
                });
            }
            else {
                var /** @type {?} */ size_1 = 1 / this.displayedAreas.length;
                this.displayedAreas.forEach(function (area) {
                    area.size = size_1;
                });
            }
        }
        // ¤
        // If some real area sizes are less than gutterSize,
        // set them to zero and dispatch size to others.
        var /** @type {?} */ percentToDispatch = 0;
        // Get container pixel size
        var /** @type {?} */ containerSizePixel = this.containerSizePx;
        this.displayedAreas.forEach(function (area) {
            if (area.size * containerSizePixel < _this.gutterSize) {
                percentToDispatch += area.size;
                area.size = 0;
            }
        });
        if (percentToDispatch > 0 && this.displayedAreas.length > 0) {
            var /** @type {?} */ nbAreasNotZero = this.displayedAreas.filter(function (a) { return a.size !== 0; }).length;
            if (nbAreasNotZero > 0) {
                var /** @type {?} */ percentToAdd_1 = percentToDispatch / nbAreasNotZero;
                this.displayedAreas.filter(function (a) { return a.size !== 0; }).forEach(function (area) {
                    area.size += percentToAdd_1;
                });
            }
            else {
                this.displayedAreas[this.displayedAreas.length - 1].size = 1;
            }
        }
        // do the extra calculation
        this.areaSizeCalculationToBeUsed.calculate(this.createAreaSizeCalculationOptions());
        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    };
    /**
     * Creates an AreaSizeCalculation-Object of currently set instance parameters
     * @param {?=} calculationSource
     * @return {?}
     */
    SplitComponent.prototype.createAreaSizeCalculationOptions = /**
     * Creates an AreaSizeCalculation-Object of currently set instance parameters
     * @param {?=} calculationSource
     * @return {?}
     */
    function (calculationSource) {
        return {
            calculationSource: calculationSource,
            containerSizePx: this.containerSizePx,
            displayedAreas: this.displayedAreas,
            gutterSizePx: this.gutterSize
        };
    };
    Object.defineProperty(SplitComponent.prototype, "containerSizePx", {
        get: /**
         * Size of the container in pixels (corresponding to direction: height or width)
         * @return {?}
         */
        function () {
            // Get container pixel size
            var /** @type {?} */ result = this.getNbGutters() * this.gutterSize;
            if (this.direction === 'horizontal') {
                result = this.width ? this.width : (/** @type {?} */ (this.elRef.nativeElement)).offsetWidth;
            }
            else {
                result = this.height ? this.height : (/** @type {?} */ (this.elRef.nativeElement)).offsetHeight;
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitComponent.prototype.refreshStyleSizes = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ sumGutterSize = this.getNbGutters() * this.gutterSize;
        this.displayedAreas.forEach(function (area) {
            area.comp.setStyleFlexbasis("calc( " + area.size * 100 + "% - " + area.size * sumGutterSize + "px )", _this.isDragging);
        });
    };
    /**
     * @param {?} startEvent
     * @param {?} gutterOrder
     * @param {?} gutterNum
     * @return {?}
     */
    SplitComponent.prototype.startDragging = /**
     * @param {?} startEvent
     * @param {?} gutterOrder
     * @param {?} gutterNum
     * @return {?}
     */
    function (startEvent, gutterOrder, gutterNum) {
        var _this = this;
        startEvent.preventDefault();
        // Place code here to allow '(gutterClick)' event even if '[disabled]="true"'.
        this.currentGutterNum = gutterNum;
        this.draggingWithoutMove = true;
        this.ngZone.runOutsideAngular(function () {
            _this.dragListeners.push(_this.renderer.listen('document', 'mouseup', function (e) { return _this.stopDragging(); }));
            _this.dragListeners.push(_this.renderer.listen('document', 'touchend', function (e) { return _this.stopDragging(); }));
            _this.dragListeners.push(_this.renderer.listen('document', 'touchcancel', function (e) { return _this.stopDragging(); }));
        });
        if (this.disabled) {
            return;
        }
        var /** @type {?} */ areaA = this.displayedAreas.find(function (a) { return a.order === gutterOrder - 1; });
        var /** @type {?} */ areaB = this.displayedAreas.find(function (a) { return a.order === gutterOrder + 1; });
        if (!areaA || !areaB) {
            return;
        }
        var /** @type {?} */ prop = (this.direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight';
        this.dragStartValues.sizePixelContainer = this.elRef.nativeElement[prop];
        this.dragStartValues.sizePixelA = areaA.comp.getSizePixel(prop);
        this.dragStartValues.sizePixelB = areaB.comp.getSizePixel(prop);
        this.dragStartValues.sizePercentA = areaA.size;
        this.dragStartValues.sizePercentB = areaB.size;
        var /** @type {?} */ start;
        if (startEvent instanceof MouseEvent) {
            start = {
                x: startEvent.screenX,
                y: startEvent.screenY,
            };
        }
        else if (startEvent instanceof TouchEvent) {
            start = {
                x: startEvent.touches[0].screenX,
                y: startEvent.touches[0].screenY,
            };
        }
        else {
            return;
        }
        this.ngZone.runOutsideAngular(function () {
            _this.dragListeners.push(_this.renderer.listen('document', 'mousemove', function (e) { return _this.dragEvent(e, start, areaA, areaB); }));
            _this.dragListeners.push(_this.renderer.listen('document', 'touchmove', function (e) { return _this.dragEvent(e, start, areaA, areaB); }));
        });
        areaA.comp.lockEvents();
        areaB.comp.lockEvents();
        this.isDragging = true;
        this.notify('start');
    };
    /**
     * @param {?} event
     * @param {?} start
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    SplitComponent.prototype.dragEvent = /**
     * @param {?} event
     * @param {?} start
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    function (event, start, areaA, areaB) {
        if (!this.isDragging) {
            return;
        }
        var /** @type {?} */ end;
        if (event instanceof MouseEvent) {
            end = {
                x: event.screenX,
                y: event.screenY,
            };
        }
        else if (event instanceof TouchEvent) {
            end = {
                x: event.touches[0].screenX,
                y: event.touches[0].screenY,
            };
        }
        else {
            return;
        }
        this.draggingWithoutMove = false;
        this.drag(start, end, areaA, areaB);
    };
    /**
     * @param {?} start
     * @param {?} end
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    SplitComponent.prototype.drag = /**
     * @param {?} start
     * @param {?} end
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    function (start, end, areaA, areaB) {
        // ¤ AREAS SIZE PIXEL
        var /** @type {?} */ devicePixelRatio = window.devicePixelRatio || 1;
        var /** @type {?} */ offsetPixel = (this.direction === 'horizontal') ? (start.x - end.x) : (start.y - end.y);
        offsetPixel = offsetPixel / devicePixelRatio;
        if (this.dir === 'rtl') {
            offsetPixel = -offsetPixel;
        }
        var /** @type {?} */ newSizePixelA = this.dragStartValues.sizePixelA - offsetPixel;
        var /** @type {?} */ newSizePixelB = this.dragStartValues.sizePixelB + offsetPixel;
        if (newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
            // WTF.. get out of here!
            return;
        }
        else if (newSizePixelA < this.gutterSize) {
            newSizePixelB += newSizePixelA;
            newSizePixelA = 0;
        }
        else if (newSizePixelB < this.gutterSize) {
            newSizePixelA += newSizePixelB;
            newSizePixelB = 0;
        }
        // ¤ AREAS SIZE PERCENT
        if (newSizePixelA === 0) {
            areaB.size += areaA.size;
            areaA.size = 0;
        }
        else if (newSizePixelB === 0) {
            areaA.size += areaB.size;
            areaB.size = 0;
        }
        else {
            // NEW_PERCENT = START_PERCENT / START_PIXEL * NEW_PIXEL;
            if (this.dragStartValues.sizePercentA === 0) {
                areaB.size = this.dragStartValues.sizePercentB / this.dragStartValues.sizePixelB * newSizePixelB;
                areaA.size = this.dragStartValues.sizePercentB - areaB.size;
            }
            else if (this.dragStartValues.sizePercentB === 0) {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = this.dragStartValues.sizePercentA - areaA.size;
            }
            else {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = (this.dragStartValues.sizePercentA + this.dragStartValues.sizePercentB) - areaA.size;
            }
        }
        this.areaSizeCalculationToBeUsed.calculate(this.createAreaSizeCalculationOptions({
            areaA: areaA,
            areaB: areaB,
            isDragAndDrop: true
        }));
        this.refreshStyleSizes();
        this.notify('progress');
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.stopDragging = /**
     * @return {?}
     */
    function () {
        if (this.isDragging === false && this.draggingWithoutMove === false) {
            return;
        }
        this.displayedAreas.forEach(function (area) {
            area.comp.unlockEvents();
        });
        while (this.dragListeners.length > 0) {
            var /** @type {?} */ fct = this.dragListeners.pop();
            if (fct) {
                fct();
            }
        }
        if (this.draggingWithoutMove === true) {
            this.notify('click');
        }
        else {
            this.notify('end');
        }
        this.isDragging = false;
        this.draggingWithoutMove = false;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    SplitComponent.prototype.notify = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        var /** @type {?} */ areasSize = this.displayedAreas.map(function (a) { return a.size * 100; });
        switch (type) {
            case 'start':
                return this.dragStart.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'progress':
                return this.dragProgress.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'end':
                return this.dragEnd.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'click':
                return this.gutterClick.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'transitionEnd':
                return this.transitionEndInternal.next(areasSize);
        }
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.stopDragging();
    };
    /**
     * @return {?}
     */
    SplitComponent.prototype.handleWindowResize = /**
     * @return {?}
     */
    function () {
        this.areaSizeCalculationToBeUsed.calculate(this.createAreaSizeCalculationOptions({
            isWindowResize: true
        }));
        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    };
    SplitComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'split',
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n        :host {\n            display: flex;\n            flex-wrap: nowrap;\n            justify-content: flex-start;\n            align-items: stretch;\n            overflow: hidden;\n            /* \n                Important to keep following rules even if overrided later by 'HostBinding' \n                because if [width] & [height] not provided, when build() is executed,\n                'HostBinding' hasn't been applied yet so code:\n                this.elRef.nativeElement[\"offsetHeight\"] gives wrong value!  \n             */\n            width: 100%;\n            height: 100%;   \n        }\n\n        split-gutter {\n            flex-grow: 0;\n            flex-shrink: 0;\n            background-position: center center;\n            background-repeat: no-repeat;\n        }\n    "],
                    template: "\n        <ng-content></ng-content>\n        <ng-template ngFor let-area [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\n            <split-gutter *ngIf=\"last === false\" \n                          [order]=\"index*2+1\"\n                          [direction]=\"direction\"\n                          [useTransition]=\"useTransition\"\n                          [size]=\"gutterSize\"\n                          [color]=\"gutterColor\"\n                          [imageH]=\"gutterImageH\"\n                          [imageV]=\"gutterImageV\"\n                          [disabled]=\"disabled\"\n                          (mousedown)=\"startDragging($event, index*2+1, index+1)\"\n                          (touchstart)=\"startDragging($event, index*2+1, index+1)\"></split-gutter>\n        </ng-template>"
                },] },
    ];
    /** @nocollapse */
    SplitComponent.ctorParameters = function () { return [
        { type: core.NgZone, },
        { type: core.ElementRef, },
        { type: core.ChangeDetectorRef, },
        { type: core.Renderer2, },
    ]; };
    SplitComponent.propDecorators = {
        "direction": [{ type: core.Input },],
        "useTransition": [{ type: core.Input },],
        "disabled": [{ type: core.Input },],
        "width": [{ type: core.Input },],
        "height": [{ type: core.Input },],
        "gutterSize": [{ type: core.Input },],
        "gutterColor": [{ type: core.Input },],
        "gutterImageH": [{ type: core.Input },],
        "gutterImageV": [{ type: core.Input },],
        "dir": [{ type: core.Input },],
        "dragStart": [{ type: core.Output },],
        "dragProgress": [{ type: core.Output },],
        "dragEnd": [{ type: core.Output },],
        "gutterClick": [{ type: core.Output },],
        "transitionEnd": [{ type: core.Output },],
        "cssFlexdirection": [{ type: core.HostBinding, args: ['style.flex-direction',] },],
        "cssWidth": [{ type: core.HostBinding, args: ['style.width',] },],
        "cssHeight": [{ type: core.HostBinding, args: ['style.height',] },],
        "cssMinwidth": [{ type: core.HostBinding, args: ['style.min-width',] },],
        "cssMinheight": [{ type: core.HostBinding, args: ['style.min-height',] },],
        "areaSizeCalculation": [{ type: core.Input },],
        "containerMinWidth": [{ type: core.HostBinding, args: ["style.min-width.px",] },],
        "containerMinHeight": [{ type: core.HostBinding, args: ["style.min-height.px",] },],
        "handleWindowResize": [{ type: core.HostListener, args: ['window:resize',] },],
    };
    return SplitComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var SplitAreaDirective = (function () {
    function SplitAreaDirective(ngZone, elRef, renderer, split) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.renderer = renderer;
        this.split = split;
        this._order = null;
        this._size = null;
        this._minSize = 0;
        this._visible = true;
        this.lockListeners = [];
    }
    Object.defineProperty(SplitAreaDirective.prototype, "order", {
        get: /**
         * @return {?}
         */
        function () {
            return this._order;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._order = !isNaN(v) ? v : null;
            this.split.updateArea(this, true, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._size;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v / 100) : null;
            this.split.updateArea(this, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "minSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._minSize;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = Number(v);
            this._minSize = (!isNaN(v) && v > 0 && v < 100) ? v / 100 : 0;
            this.split.updateArea(this, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "minSizePx", {
        get: /**
         * @return {?}
         */
        function () {
            return this._minSizePx;
        },
        set: /**
         * minimum size (in pixels) of the splitArea
         * @param {?} v
         * @return {?}
         */
        function (v) {
            console.log("set minWidthPx", v);
            this._minSizePx = v;
            this.split.updateArea(this, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "visible", {
        get: /**
         * @return {?}
         */
        function () {
            return this._visible;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
            this._visible = v;
            if (this.visible) {
                this.split.showArea(this);
            }
            else {
                this.split.hideArea(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.split.addArea(this);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', '0');
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', '0');
        this.ngZone.runOutsideAngular(function () {
            _this.transitionListener = _this.renderer.listen(_this.elRef.nativeElement, 'transitionend', function (e) { return _this.onTransitionEnd(e); });
        });
    };
    /**
     * @param {?} prop
     * @return {?}
     */
    SplitAreaDirective.prototype.getSizePixel = /**
     * @param {?} prop
     * @return {?}
     */
    function (prop) {
        return this.elRef.nativeElement[prop];
    };
    /**
     * @param {?} isVisible
     * @param {?} isDragging
     * @param {?} direction
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleVisibleAndDir = /**
     * @param {?} isVisible
     * @param {?} isDragging
     * @param {?} direction
     * @return {?}
     */
    function (isVisible, isDragging, direction) {
        if (isVisible === false) {
            this.setStyleFlexbasis('0', isDragging);
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-x', 'hidden');
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-y', 'hidden');
            if (direction === 'vertical') {
                this.renderer.setStyle(this.elRef.nativeElement, 'max-width', '0');
            }
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-x', 'hidden');
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-y', 'auto');
            this.renderer.removeStyle(this.elRef.nativeElement, 'max-width');
        }
        if (direction === 'horizontal') {
            this.renderer.setStyle(this.elRef.nativeElement, 'height', '100%');
            this.renderer.removeStyle(this.elRef.nativeElement, 'width');
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, 'width', '100%');
            this.renderer.removeStyle(this.elRef.nativeElement, 'height');
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleOrder = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    };
    /**
     * @param {?} value
     * @param {?} isDragging
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleFlexbasis = /**
     * @param {?} value
     * @param {?} isDragging
     * @return {?}
     */
    function (value, isDragging) {
        // If component not yet initialized or gutter being dragged, disable transition
        if (this.split.isViewInitialized === false || isDragging === true) {
            this.setStyleTransition(false);
        }
        else {
            this.setStyleTransition(this.split.useTransition);
        }
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', value);
    };
    /**
     * @param {?} value
     * @param {?} direction
     * @return {?}
     */
    SplitAreaDirective.prototype.setSizePx = /**
     * @param {?} value
     * @param {?} direction
     * @return {?}
     */
    function (value, direction) {
        this.renderer.removeStyle(this.elRef.nativeElement, 'flex-basis');
        if (direction === 'horizontal') {
            this.renderer.setStyle(this.elRef.nativeElement, "width", value + "px");
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, "height", value + "px");
        }
    };
    /**
     * @param {?} useTransition
     * @return {?}
     */
    SplitAreaDirective.prototype.setStyleTransition = /**
     * @param {?} useTransition
     * @return {?}
     */
    function (useTransition) {
        if (useTransition) {
            this.renderer.setStyle(this.elRef.nativeElement, 'transition', "flex-basis 0.3s");
        }
        else {
            this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SplitAreaDirective.prototype.onTransitionEnd = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Limit only flex-basis transition to trigger the event
        if (event.propertyName === 'flex-basis') {
            this.split.notify('transitionEnd');
        }
    };
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.lockEvents = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'selectstart', function (e) { return false; }));
            _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'dragstart', function (e) { return false; }));
        });
    };
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.unlockEvents = /**
     * @return {?}
     */
    function () {
        while (this.lockListeners.length > 0) {
            var /** @type {?} */ fct = this.lockListeners.pop();
            if (fct) {
                fct();
            }
        }
    };
    /**
     * @return {?}
     */
    SplitAreaDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    };
    SplitAreaDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'split-area'
                },] },
    ];
    /** @nocollapse */
    SplitAreaDirective.ctorParameters = function () { return [
        { type: core.NgZone, },
        { type: core.ElementRef, },
        { type: core.Renderer2, },
        { type: SplitComponent, },
    ]; };
    SplitAreaDirective.propDecorators = {
        "order": [{ type: core.Input },],
        "size": [{ type: core.Input },],
        "minSize": [{ type: core.Input },],
        "minSizePx": [{ type: core.Input },],
        "visible": [{ type: core.Input },],
    };
    return SplitAreaDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var SplitGutterDirective = (function () {
    ////
    function SplitGutterDirective(elRef, renderer) {
        this.elRef = elRef;
        this.renderer = renderer;
        this._disabled = false;
    }
    Object.defineProperty(SplitGutterDirective.prototype, "order", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this.renderer.setStyle(this.elRef.nativeElement, 'order', v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "direction", {
        get: /**
         * @return {?}
         */
        function () {
            return this._direction;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._direction = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "useTransition", {
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v) {
                this.renderer.setStyle(this.elRef.nativeElement, 'transition', "flex-basis 0.3s");
            }
            else {
                this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "size", {
        get: /**
         * @return {?}
         */
        function () {
            return this._size;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._size = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "color", {
        get: /**
         * @return {?}
         */
        function () {
            return this._color;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._color = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "imageH", {
        get: /**
         * @return {?}
         */
        function () {
            return this._imageH;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._imageH = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "imageV", {
        get: /**
         * @return {?}
         */
        function () {
            return this._imageV;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._imageV = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () {
            return this._disabled;
        },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            this._disabled = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SplitGutterDirective.prototype.refreshStyle = /**
     * @return {?}
     */
    function () {
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', this.size + "px");
        // fix safari bug about gutter height when direction is horizontal
        this.renderer.setStyle(this.elRef.nativeElement, 'height', (this.direction === 'vertical') ? this.size + "px" : "100%");
        this.renderer.setStyle(this.elRef.nativeElement, 'background-color', (this.color !== '') ? this.color : "#eeeeee");
        var /** @type {?} */ state = (this.disabled === true) ? 'disabled' : this.direction;
        this.renderer.setStyle(this.elRef.nativeElement, 'background-image', this.getImage(state));
        this.renderer.setStyle(this.elRef.nativeElement, 'cursor', this.getCursor(state));
    };
    /**
     * @param {?} state
     * @return {?}
     */
    SplitGutterDirective.prototype.getCursor = /**
     * @param {?} state
     * @return {?}
     */
    function (state) {
        switch (state) {
            case 'horizontal':
                return 'col-resize';
            case 'vertical':
                return 'row-resize';
            case 'disabled':
                return 'default';
        }
    };
    /**
     * @param {?} state
     * @return {?}
     */
    SplitGutterDirective.prototype.getImage = /**
     * @param {?} state
     * @return {?}
     */
    function (state) {
        switch (state) {
            case 'horizontal':
                return (this.imageH !== '') ? this.imageH : defaultImageH;
            case 'vertical':
                return (this.imageV !== '') ? this.imageV : defaultImageV;
            case 'disabled':
                return '';
        }
    };
    SplitGutterDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'split-gutter'
                },] },
    ];
    /** @nocollapse */
    SplitGutterDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: core.Renderer2, },
    ]; };
    SplitGutterDirective.propDecorators = {
        "order": [{ type: core.Input },],
        "direction": [{ type: core.Input },],
        "useTransition": [{ type: core.Input },],
        "size": [{ type: core.Input },],
        "color": [{ type: core.Input },],
        "imageH": [{ type: core.Input },],
        "imageV": [{ type: core.Input },],
        "disabled": [{ type: core.Input },],
    };
    return SplitGutterDirective;
}());
var defaultImageH = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==")';
var defaultImageV = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC")';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AngularSplitModule = (function () {
    function AngularSplitModule() {
    }
    /**
     * @return {?}
     */
    AngularSplitModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    };
    /**
     * @return {?}
     */
    AngularSplitModule.forChild = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    };
    AngularSplitModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule
                    ],
                    declarations: [
                        SplitComponent,
                        SplitAreaDirective,
                        SplitGutterDirective,
                    ],
                    exports: [
                        SplitComponent,
                        SplitAreaDirective,
                    ]
                },] },
    ];
    /** @nocollapse */
    AngularSplitModule.ctorParameters = function () { return []; };
    return AngularSplitModule;
}());

exports.AngularSplitModule = AngularSplitModule;
exports.SplitComponent = SplitComponent;
exports.SplitAreaDirective = SplitAreaDirective;
exports.ɵa = SplitGutterDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-split.umd.js.map
