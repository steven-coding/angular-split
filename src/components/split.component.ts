import {
    Component, ChangeDetectorRef, Input, Output, HostBinding, ChangeDetectionStrategy,
    EventEmitter, Renderer2, OnDestroy, ElementRef, AfterViewInit, NgZone, HostListener
} from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { IArea } from './../interface/IArea';
import { IPoint } from './../interface/IPoint';
import { SplitAreaDirective } from './split-area.directive';
import {IAreaSizeCalculation} from "../interface/calculation/IAreaSizeCalculation";
import {AreaSizeCalculation} from "./calculation/area-size-calculation";
import {IAreaSizeCalculationOptions} from "../interface/calculation/IAreaSizeCalculationOptions";
import {
    IAreaDragAndDropCalculationSource
} from "../interface/calculation/calculation-sources/IAreaDragAndDropCalculationSource";
import {
    IWindowResizeCalculationSource
} from "../interface/calculation/calculation-sources/IWindowResizeCalculationSource";
import {Area} from "./models/area";
import {debounceTime} from 'rxjs/operators';

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

@Component({
    selector: 'split',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        :host {
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: stretch;
            overflow: hidden;
            /* 
                Important to keep following rules even if overrided later by 'HostBinding' 
                because if [width] & [height] not provided, when build() is executed,
                'HostBinding' hasn't been applied yet so code:
                this.elRef.nativeElement["offsetHeight"] gives wrong value!  
             */
            width: 100%;
            height: 100%;   
        }

        split-gutter {
            display: flex;
            flex-grow: 0;
            flex-shrink: 0;
        }
    `],
    template: `
        <ng-content select="split-area"></ng-content>
        <ng-template ngFor let-area [ngForOf]="displayedAreas" let-index="index" let-last="last">
            <split-gutter *ngIf="last === false" 
                          [order]="index*2+1"
                          [direction]="direction"
                          [useTransition]="useTransition"
                          [size]="gutterSize"
                          [color]="gutterColor"
                          [imageH]="gutterImageH"
                          [imageV]="gutterImageV"
                          [disabled]="disabled"
                          (mousedown)="startDragging($event, index*2+1, index+1)"
                          (touchstart)="startDragging($event, index*2+1, index+1)">
                <ng-content select="[template='gutter']"></ng-content>
            </split-gutter>
        </ng-template>`
})
export class SplitComponent implements AfterViewInit, OnDestroy {



    private _direction: 'horizontal' | 'vertical' = 'horizontal';

    @Input() set direction(v: 'horizontal' | 'vertical') {
        v = (v === 'vertical') ? 'vertical' : 'horizontal';
        this._direction = v;
        
        [...this.displayedAreas, ...this.hidedAreas].forEach(area => {
            area.comp.setStyleVisibleAndDir(area.comp.visible, this.isDragging, this.direction);
        });
        
        this.build(false, false);
    }
    
    get direction(): 'horizontal' | 'vertical' {
        return this._direction;
    }
    
    ////

    private _useTransition: boolean = false;

    @Input() set useTransition(v: boolean) {
        v = (typeof(v) === 'boolean') ? v : (v === 'false' ? false : true);
        this._useTransition = v;
    }
    
    get useTransition(): boolean {
        return this._useTransition;
    }
    
    ////

    private _disabled: boolean = false;
    
    @Input() set disabled(v: boolean) {
        v = (typeof(v) === 'boolean') ? v : (v === 'false' ? false : true);
        this._disabled = v;

        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    
    get disabled(): boolean {
        return this._disabled;
    }
    
    ////

    private _width: number | null = null;

    @Input() set width(v: number | null) {
        v = Number(v);
        this._width = (!isNaN(v) && v > 0) ? v : null;
        
        this.build(false, false);
    }
    
    get width(): number | null {
        return this._width;
    }
    
    ////

    private _height: number | null = null;

    @Input() set height(v: number | null) {
        v = Number(v);
        this._height = (!isNaN(v) && v > 0) ? v : null;
        
        this.build(false, false);
    }
    
    get height(): number | null {
        return this._height;
    }
    
    ////

    private _gutterSize: number = 11;

    @Input() set gutterSize(v: number) {
        v = Number(v);
        this._gutterSize = (!isNaN(v) && v > 0) ? v : 11;

        this.build(false, false);
    }
    
    get gutterSize(): number {
        return this._gutterSize;
    }
    
    ////

    private _gutterColor: string = '';

    @Input() set gutterColor(v: string) {
        this._gutterColor = (typeof v === 'string' && v !== '') ? v : '';

        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    
    get gutterColor(): string {
        return this._gutterColor;
    }
    
    ////

    private _gutterImageH: string = '';

    @Input() set gutterImageH(v: string) {
        this._gutterImageH = (typeof v === 'string' && v !== '') ? v : '';
        
        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    
    get gutterImageH(): string {
        return this._gutterImageH;
    }
    
    ////

    private _gutterImageV: string = '';

    @Input() set gutterImageV(v: string) {
        this._gutterImageV = (typeof v === 'string' && v !== '') ? v : '';

        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    
    get gutterImageV(): string {
        return this._gutterImageV;
    }

    ////

    private _dir: 'ltr' | 'rtl' = 'ltr';
    
    @Input() set dir(v: 'ltr' | 'rtl') {
        v = (v === 'rtl') ? 'rtl' : 'ltr';
        this._dir = v;
    }
    
    get dir(): 'ltr' | 'rtl' {
        return this._dir;
    }

    ////

    @Output() dragStart = new EventEmitter<{gutterNum: number, sizes: Array<number>}>(false);
    @Output() dragProgress = new EventEmitter<{gutterNum: number, sizes: Array<number>}>(false);
    @Output() dragEnd = new EventEmitter<{gutterNum: number, sizes: Array<number>}>(false);
    @Output() gutterClick = new EventEmitter<{gutterNum: number, sizes: Array<number>}>(false);

	/**
	 * notifies size changes on an area
	 */
    @Output() public currentSizeChange = new EventEmitter<{areaOrder: number, size: number}>();

    private transitionEndInternal = new Subject<Array<number>>();
    @Output() transitionEnd = (<Observable<Array<number>>> this.transitionEndInternal.asObservable()).pipe(debounceTime(20));

    @HostBinding('style.flex-direction') get cssFlexdirection() {
        return (this.direction === 'horizontal') ? 'row' : 'column';
    }

    @HostBinding('style.width') get cssWidth() {
        return this.width ? `${ this.width }px` : '100%';
    }

    @HostBinding('style.height') get cssHeight() {
        return this.height ? `${ this.height }px` : '100%';
    }

    @HostBinding('style.min-width') get cssMinwidth() {
        return (this.direction === 'horizontal') ? `${ this.getNbGutters() * this.gutterSize }px` : null;
    }

    @HostBinding('style.min-height') get cssMinheight() {
        return (this.direction === 'vertical') ? `${ this.getNbGutters() * this.gutterSize }px` : null;
    }

    private defaultAreaSizeCalculation: IAreaSizeCalculation = new AreaSizeCalculation();

    private _areaSizeCalculation: IAreaSizeCalculation;

    @Input() public set areaSizeCalculation(v: IAreaSizeCalculation) {
        this._areaSizeCalculation = v;
    }

    public get areaSizeCalculation(): IAreaSizeCalculation {
        return this._areaSizeCalculation;
    }

    public get areaSizeCalculationToBeUsed() {
        return this.areaSizeCalculation ? this.areaSizeCalculation : this.defaultAreaSizeCalculation;
    }

    public isViewInitialized: boolean = false;
    private isDragging: boolean = false;
    private draggingWithoutMove: boolean = false;
    private currentGutterNum: number = 0;

    public readonly displayedAreas: IArea[] = [];
    private readonly hidedAreas: IArea[] = [];
    
    private readonly dragListeners: Function[] = [];
    private readonly dragStartValues = {
        sizePixelContainer: 0,
        sizePixelA: 0,
        sizePixelB: 0,
        sizePercentA: 0,
        sizePercentB: 0,
    };

	/**
	 * last checked container with for not handling resize-events multiple times
	 */
    private lastCheckedContainerSizePx: number;

    constructor(private ngZone: NgZone,
                private elRef: ElementRef,
                private cdRef: ChangeDetectorRef,
                private renderer: Renderer2) {}



    public addArea(comp: SplitAreaDirective): void {

        const newArea: Area = new Area({
            comp,
            minSizePx: comp.minSizePx,
            maxSizePx: comp.maxSizePx,
            order: 0,
            size: 0
        });

        newArea.sizeChanged.subscribe(
            (newSize: number) => this.fireSizeChanged(newArea, newSize * 100)
        );

        if (comp.visible === true) {
            this.displayedAreas.push(newArea);
        } else {
            this.hidedAreas.push(newArea);
        }

        comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);

        this.build(true, true);
    }

    public removeArea(comp: SplitAreaDirective): void {
        if (this.displayedAreas.some((a) => a.comp === comp)) {
            const area = this.displayedAreas.find((a) => a.comp === comp) as IArea;
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);

            this.build(true, true);
        } else if (this.hidedAreas.some((a) => a.comp === comp)) {
            const area = this.hidedAreas.find((a) => a.comp === comp) as IArea;
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    }

    public updateArea(comp: SplitAreaDirective, resetOrders: boolean, resetSizes: boolean): void {
        // Only refresh if area is displayed (No need to check inside 'hidedAreas')
        const item = this.displayedAreas.find((a) => a.comp === comp);

        if (item) {
            // use minSizePx of the component
            item.minSizePx = comp.minSizePx;

            // use maxSizePx of the component
            item.maxSizePx = comp.maxSizePx;

            this.build(resetOrders, resetSizes);
        }
    }

    public showArea(comp: SplitAreaDirective): void {
        const area = this.hidedAreas.find(a => a.comp === comp);

        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);

            const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            this.displayedAreas.push(...areas);

            this.build(true, true);
        }
    }

    public hideArea(comp: SplitAreaDirective): void {
        const area = this.displayedAreas.find(a => a.comp === comp);

        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);

            const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            areas.forEach((currentArea) => {
                currentArea.order = 0;
                currentArea.size = 0;
            });
            this.hidedAreas.push(...areas);

            this.build(true, true);
        }
    }

    /**
     * Min-Width of the container
     */
    @HostBinding("style.min-width.px")
    public get containerMinWidth(): number | undefined {
        if(!this.setMinSizeOnContainer)
            return undefined;

        // if split direction is NOT vertical
        if (this.direction !== "horizontal") {

            // min-width is 0 (unset)
            return 0;
        }

        // return the sum of all area minSizes + gutter sizes
        return this.getMinSizeOfAllDisplayedComponentsPlusGutterSize();
    }

    /**
     * Min-Height of the container
     */
    @HostBinding("style.min-height.px")
    public get containerMinHeight(): number | undefined {
        if(!this.setMinSizeOnContainer)
            return undefined;

        // if split direction is NOT vertical
        if (this.direction !== "vertical") {

            // min-height is 0 (unset)
            return 0;
        }

        // return the sum of all area minSizes + gutter sizes
        return this.getMinSizeOfAllDisplayedComponentsPlusGutterSize();
    }

    public ngAfterViewInit() {
        this.isViewInitialized = true;
    }

    @Input() public setMinSizeOnContainer: boolean = false;

    /**
     * Sum of all area minSizes + gutter sizes
     */
    private getMinSizeOfAllDisplayedComponentsPlusGutterSize(): number {
        if (!this.displayedAreas || this.displayedAreas.length === 0) {
            return 0;
        }

        return this.getMinSizeOfAllDisplayedComponents() + (this.gutterSize * (this.displayedAreas.length - 1));
    }

    /**
     * Sum of all area minSizes
     */
    private getMinSizeOfAllDisplayedComponents(): number {
        if (!this.displayedAreas || this.displayedAreas.length === 0) {
            return 0;
        }

        let result = 0;

        this.displayedAreas.forEach((area) => {
            if (area.minSizePx) {
                result += area.minSizePx;
            }

        });

        return result;
    }

    private getNbGutters(): number {
        return this.displayedAreas.length - 1;
    }

    private build(resetOrders: boolean, resetSizes: boolean): void {
        this.stopDragging();

        // ¤ AREAS ORDER
        if (resetOrders === true) {

            // If user provided 'order' for each area, use it to sort them.
            if (this.displayedAreas.every((a) => a.comp.order !== null)) {
                this.displayedAreas.sort((a, b) => (a.comp.order as number) - (b.comp.order as number));
            }

            // Then set real order with multiples of 2, numbers between will be used by gutters.
            this.displayedAreas.forEach((area, i) => {
                area.order = i * 2;
                area.comp.setStyleOrder(area.order);
            });

        }

        // ¤ AREAS SIZE PERCENT

        if (resetSizes === true) {

            const totalUserSize = this.displayedAreas.reduce(
                (total: number, s: IArea) => s.comp.size ? total + s.comp.size : total, 0) as number;

            // If user provided 'size' for each area and total == 1, use it.
            if (this.displayedAreas.every((a) => a.comp.size !== null) 
                && totalUserSize > .999
                && totalUserSize < 1.001 ) {

                this.displayedAreas.forEach((area) => {
                    area.size = area.comp.size as number;
                });
            }
            // Else set equal sizes for all areas.
            else {
                const size = 1 / this.displayedAreas.length;
                
                this.displayedAreas.forEach(area => {
                    area.size = size;
                });
            }
        }
        
        // ¤ 
        // If some real area sizes are less than gutterSize, 
        // set them to zero and dispatch size to others.

        let percentToDispatch = 0;
        
        // Get container pixel size
        const containerSizePixel = this.containerSizePx;

        this.displayedAreas.forEach(area => {
            if(area.size * containerSizePixel < this.gutterSize) {
                percentToDispatch += area.size;
                area.size = 0;
            }
        });
        
        if(percentToDispatch > 0 && this.displayedAreas.length > 0) {
            const nbAreasNotZero = this.displayedAreas.filter(a => a.size !== 0).length;

            if(nbAreasNotZero > 0) {
                const percentToAdd = percentToDispatch / nbAreasNotZero;
    
                this.displayedAreas.filter(a => a.size !== 0).forEach(area => {
                    area.size += percentToAdd;
                });
            }
            // All area sizes (container percentage) are less than guterSize,
            // It means containerSize < ngGutters * gutterSize
            else {
                this.displayedAreas[this.displayedAreas.length - 1].size = 1;
            }
        }

        // do the extra calculation
        this.areaSizeCalculationToBeUsed.calculate(this.createAreaSizeCalculationOptions());

        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    }

    /**
     * Creates an AreaSizeCalculation-Object of currently set instance parameters
     */
    private createAreaSizeCalculationOptions(
        calculationSource?: IAreaDragAndDropCalculationSource | IWindowResizeCalculationSource
    ): IAreaSizeCalculationOptions {
        return {
            calculationSource,
            containerSizePx: this.containerSizePx,
            displayedAreas: this.displayedAreas,
            gutterSizePx: this.gutterSize
        };
    }

    /**
     * Size of the container in pixels (corresponding to direction: height or width)
     */
    private get containerSizePx(): number {
         // Get container pixel size
         let result = this.getNbGutters() * this.gutterSize;
         if (this.direction === 'horizontal') {
            result = this.width ? this.width : (this.elRef.nativeElement as HTMLElement).offsetWidth;
         } else {
            result = this.height ? this.height : (this.elRef.nativeElement as HTMLElement).offsetHeight;
         }

         return result;
    }


    private refreshStyleSizes(): void {
        const sumGutterSize = this.getNbGutters() * this.gutterSize;

        this.displayedAreas.forEach((area) => {
            area.comp.setStyleFlexbasis(
                `calc( ${ area.size * 100 }% - ${ area.size * sumGutterSize }px )`,
                this.isDragging
            );
        });
    }

    public startDragging(startEvent: MouseEvent | TouchEvent, gutterOrder: number, gutterNum: number): void {
        startEvent.preventDefault();

        // Place code here to allow '(gutterClick)' event even if '[disabled]="true"'.
        this.currentGutterNum = gutterNum;
        this.draggingWithoutMove = true;
        this.ngZone.runOutsideAngular(() => {
            this.dragListeners.push( this.renderer.listen('document', 'mouseup', (e: MouseEvent) => this.stopDragging()) );
            this.dragListeners.push( this.renderer.listen('document', 'touchend', (e: TouchEvent) => this.stopDragging()) );
            this.dragListeners.push( this.renderer.listen('document', 'touchcancel', (e: TouchEvent) => this.stopDragging()) );
        });

        if(this.disabled) {
            return;
        }

        const areaA = this.displayedAreas.find(a => a.order === gutterOrder - 1);
        const areaB = this.displayedAreas.find(a => a.order === gutterOrder + 1);
        
        if(!areaA || !areaB) {
            return;
        }

        const prop = (this.direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight';
        this.dragStartValues.sizePixelContainer = this.elRef.nativeElement[prop];
        this.dragStartValues.sizePixelA = areaA.comp.getSizePixel(prop);
        this.dragStartValues.sizePixelB = areaB.comp.getSizePixel(prop);
        this.dragStartValues.sizePercentA = areaA.size;
        this.dragStartValues.sizePercentB = areaB.size;

        let start: IPoint;
        if(startEvent instanceof MouseEvent) {
            start = {
                x: startEvent.screenX,
                y: startEvent.screenY,
            };
        }
        else if(startEvent instanceof TouchEvent) {
            start = {
                x: startEvent.touches[0].screenX,
                y: startEvent.touches[0].screenY,
            };
        }
        else {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            this.dragListeners.push( this.renderer.listen('document', 'mousemove', (e: MouseEvent) => this.dragEvent(e, start, areaA, areaB)) );
            this.dragListeners.push( this.renderer.listen('document', 'touchmove', (e: TouchEvent) => this.dragEvent(e, start, areaA, areaB)) );
        });

        areaA.comp.lockEvents();
        areaB.comp.lockEvents();

        this.isDragging = true;

        this.notify('start');
    }

    private dragEvent(event: MouseEvent | TouchEvent, start: IPoint, areaA: IArea, areaB: IArea): void {
        if(!this.isDragging) {
            return;
        }

        let end: IPoint;
        if(event instanceof MouseEvent) {
            end = {
                x: event.screenX,
                y: event.screenY,
            };
        }
        else if(event instanceof TouchEvent) {
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
    }

    private drag(start: IPoint, end: IPoint, areaA: IArea, areaB: IArea): void {
        
        // ¤ AREAS SIZE PIXEL

        
        let offsetPixel = (this.direction === 'horizontal') ? (start.x - end.x) : (start.y - end.y);
        
        /* const devicePixelRatio = window.devicePixelRatio || 1; //doesn't work
        offsetPixel = offsetPixel / devicePixelRatio; //doesn't work */
        
        if(this.dir === 'rtl') {
            offsetPixel = -offsetPixel;
        }

        let newSizePixelA = this.dragStartValues.sizePixelA - offsetPixel;
        let newSizePixelB = this.dragStartValues.sizePixelB + offsetPixel;

        if (newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
            // WTF.. get out of here!
            return;
        }
        else if(newSizePixelA < this.gutterSize) {
            newSizePixelB += newSizePixelA;
            newSizePixelA = 0;
        }
        else if(newSizePixelB < this.gutterSize) {
            newSizePixelA += newSizePixelB;
            newSizePixelB = 0;
        }    

        // ¤ AREAS SIZE PERCENT

        if(newSizePixelA === 0) {
            areaB.size += areaA.size;
            areaA.size = 0;
        }
        else if(newSizePixelB === 0) {
            areaA.size += areaB.size;
            areaB.size = 0;
        }
        else {
            // NEW_PERCENT = START_PERCENT / START_PIXEL * NEW_PIXEL;
            if(this.dragStartValues.sizePercentA === 0) {
                areaB.size = this.dragStartValues.sizePercentB / this.dragStartValues.sizePixelB * newSizePixelB;
                areaA.size = this.dragStartValues.sizePercentB - areaB.size;
            }
            else if(this.dragStartValues.sizePercentB === 0) {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = this.dragStartValues.sizePercentA - areaA.size;
            }
            else {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = (this.dragStartValues.sizePercentA + this.dragStartValues.sizePercentB) - areaA.size;
            }
        }

        this.areaSizeCalculationToBeUsed.calculate(
            this.createAreaSizeCalculationOptions({
                areaA,
                areaB,
                isDragAndDrop: true,
                offsetPixel
            })
        );
        this.refreshStyleSizes();
        this.notify('progress');
    }

    private stopDragging(): void {
        if(this.isDragging === false && this.draggingWithoutMove === false) {
            return;
        }

        this.displayedAreas.forEach(area => {
            area.comp.unlockEvents();
        });

        while(this.dragListeners.length > 0) {
            const fct = this.dragListeners.pop();
            if(fct) {
                fct();
            }
        }
        
        if(this.draggingWithoutMove === true) {
            this.notify('click');
        }
        else {
            this.notify('end');
        }

        this.isDragging = false;
        this.draggingWithoutMove = false;

        //trigger resize-event - components can handle it and react to new sizes accordingly
        this.triggerWindowResize();
    }

    public notify(type: 'start' | 'progress' | 'end' | 'click' | 'transitionEnd'): void {
        const areasSize: Array<number> = this.displayedAreas.map(a => a.size * 100);

        switch(type) {
            case 'start':
                return this.dragStart.emit({gutterNum: this.currentGutterNum, sizes: areasSize});

            case 'progress':
                return this.dragProgress.emit({gutterNum: this.currentGutterNum, sizes: areasSize});

            case 'end':
                return this.dragEnd.emit({gutterNum: this.currentGutterNum, sizes: areasSize});
                
            case 'click':
                return this.gutterClick.emit({gutterNum: this.currentGutterNum, sizes: areasSize});

            case 'transitionEnd':
                return this.transitionEndInternal.next(areasSize);
        }
    }

    /**
     * Moves the gutter to it's max position between two areas
     *
     * @param gutterOrderIndex Index of the gutter to be moved
     */
    public moveGutterMax(gutterOrderIndex: number) {
        this.moveGutterToPosition(gutterOrderIndex, Number.MAX_VALUE);
    }

    /**
     * Moves the gutter to it's min position between two areas
     *
     * @param gutterOrderIndex Index of the gutter to be moved
     */
    public moveGutterMin(gutterOrderIndex: number) {
        this.moveGutterToPosition(gutterOrderIndex, 0);
    }


    /**
     * Moves the gutter to given position in Pixels
     *
     * @param gutterOrderIndex Index of the gutter to be moved
     * @param positionInPx new gutter position in px
     *
     * @version 0.2.8 triggers Window-Resize
     */
    public moveGutterToPosition(gutterOrderIndex: number, positionInPx: number) {

        // area on left side of the gutter
        const areaA = this.displayedAreas.find(a => a.order === gutterOrderIndex - 1);
        // area on right side of the gutter
        const areaB = this.displayedAreas.find(a => a.order === gutterOrderIndex + 1);

        // if one of both areas couldn't be found
        if(!areaA || !areaB) {
            // the gutter in between can't be moved
            return;
        }

        const sizePixelA: number = areaA.comp.getSizePixel( (this.direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight');
        const sizePixelB: number = areaB.comp.getSizePixel( (this.direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight');
        const totalSizePx: number = sizePixelA + sizePixelB;
        const totalSizePcnt: number = areaA.size + areaB.size;

        let newSizePixelA = sizePixelA;
        let newSizePixelB = sizePixelB;

        // sizing left side component and right side component takes available space (=== true)
        const isLeftSideSizing: boolean = positionInPx >= 0;

        //sizing left side component, if positionInPx is > 0
        if(isLeftSideSizing) {

            // left side componen will be positionInPx or totalSizePx (if it is smaller than positionInPx)
            newSizePixelA = positionInPx < totalSizePx ? positionInPx : totalSizePx;

            // right side component will take space still available
            newSizePixelB = totalSizePx - newSizePixelA;
        }
        //sizing right side component, if positionInPx is < 0
        else {

            // absolute size of required right side component width
            const absolutePositionInPx = Math.abs(positionInPx);

            // right side componen will be absolutePositionInPx or totalSizePx (if it is smaller than absolutePositionInPx)
            newSizePixelB = absolutePositionInPx < totalSizePx ? absolutePositionInPx : totalSizePx;

            // left side component will take space still available
            newSizePixelA = totalSizePx - newSizePixelB;
        }

        if (newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
            // WTF.. get out of here!
            return;
        }
        else if(newSizePixelA < this.gutterSize) {
            newSizePixelB += newSizePixelA;
            newSizePixelA = 0;
        }
        else if(newSizePixelB < this.gutterSize) {
            newSizePixelA += newSizePixelB;
            newSizePixelB = 0;
        }

        areaA.size = newSizePixelA / totalSizePx * totalSizePcnt;
        areaB.size = newSizePixelB / totalSizePx * totalSizePcnt;

        let draggedAreas: IArea[] = [];

        // component sizes will be checked / corrected in given order
        // if gutter movement is negative (= sizing area B)
        if(!isLeftSideSizing) {

            // areaB size should be checked / fixed first and diff space will be taken from areaA
            draggedAreas = [areaB, areaA];

        } else {

            // areaA size should be checked / fixed first and diff space will be taken from areaB
            draggedAreas = [areaA, areaB];
        }

        //drag-offset in pixel = size of areaA in px before resizing - size of areaA in px after resizing
        const pseudoDragOffset = sizePixelA - newSizePixelA;

        // reuse drag-and-drop calculation (because it is like a "fast drag-and-drop")
        this.areaSizeCalculationToBeUsed.calculate(
            this.createAreaSizeCalculationOptions({
                areaA: draggedAreas[0],
                areaB: draggedAreas[1],
                isDragAndDrop: true,
                offsetPixel: pseudoDragOffset,
            })
        );
        this.refreshStyleSizes();
        this.triggerWindowResize();
    }

    public ngOnDestroy(): void {
        this.stopDragging();
    }

    @HostListener('window:resize')
    public handleWindowResize(): void {
        // if container size remains the same as the size we have checked
        if(this.lastCheckedContainerSizePx === this.containerSizePx) {
            //there is nothing to do
            return;
        }

        this.lastCheckedContainerSizePx = this.containerSizePx;

        this.areaSizeCalculationToBeUsed.calculate(this.createAreaSizeCalculationOptions({
            isWindowResize: true
        }));

        this.refreshStyleSizes();
        this.cdRef.markForCheck();

        //trigger resize-event - components can handle it and react to new sizes accordingly
        this.triggerWindowResize();
    }

    private fireSizeChanged(area: IArea, newSize: number) {
        this.currentSizeChange.next({
            size: newSize,
            areaOrder: area.order
        });
    }

    /**
     * Triggers the window-resize event, so component inside the (resized) areas can re-layout with given widths / heights
     */
    private triggerWindowResize() {

        // save current sizePx, so we don't check the sizes within handleWindowResize again
        this.lastCheckedContainerSizePx = this.containerSizePx;

        try {
            // For a full list of event types: https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
            var event = document.createEvent('HTMLEvents');
            event.initEvent('resize', true, false);
            window.dispatchEvent(event);
        } catch(error) {
            console.warn("triggerWindowResize", error);
        }
    }
}
