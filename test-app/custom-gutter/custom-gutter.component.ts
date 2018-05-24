import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output} from '@angular/core';
@Component({
    moduleId: module.id,
    selector: 'custom-gutter',
    styleUrls: ['custom-gutter.component.css'],
    templateUrl: 'custom-gutter.component.html'
})
export class CustomGutterComponent implements AfterViewInit {

    public gutterOrderIndex: number;

    @Output()
    public onMoveGutterMin = new EventEmitter<number>();

    @Output()
    public onMoveGutterMax = new EventEmitter<number>();

    @Output()
    public onShowBothAreas = new EventEmitter<number>();

    constructor(
        protected elementRef: ElementRef,
        protected cdRef: ChangeDetectorRef
    ) {}


    public moveGutterMax() {
        this.onMoveGutterMax.next(this.gutterOrderIndex);
    }

    public moveGutterMin() {
        this.onMoveGutterMin.next(this.gutterOrderIndex);
    }

    public showBothAreas() {
        this.onShowBothAreas.next(this.gutterOrderIndex);
    }

    /**
     * Retrieving order from split gutter style
     */
    protected initializeGutterOrderIndex() {
        if(!this.elementRef || !this.elementRef.nativeElement) {
            return
        }

        const splitGutterElement: HTMLElement = (this.elementRef.nativeElement as HTMLElement).closest("split-gutter") as HTMLElement;

        if(!splitGutterElement || !splitGutterElement.style || !splitGutterElement.style.order) {
            return;
        }


        this.gutterOrderIndex = +splitGutterElement.style.order;
        this.cdRef.detectChanges();
    }

    public ngAfterViewInit() {
        this.initializeGutterOrderIndex();
    }

}