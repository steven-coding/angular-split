import {Input, Component, HostBinding, AfterContentInit, ViewChild, ElementRef} from '@angular/core';

/**
 * Handling gutter layouting and default / custom gutter rendering
 */
@Component({
    selector: 'split-gutter',
    styles: [`
        split-gutter-default {
            background-position: center center;
            background-repeat: no-repeat;
        }
        
        .custom-gutter {
            display: none;
        }
        
        .custom-gutter.custom-gutter-visible {
            display: block;
            flex: 1 1 auto;
            position: relative;
        }
    `],
    template: ` <div class="custom-gutter" [class.custom-gutter-visible]="useCustomGutter" #customGutter><ng-content></ng-content></div>
                <split-gutter-default *ngIf="useDefaultGutter"
                                     [direction]="direction"
                                     [size]="size"
                                     [color]="color"
                                     [imageH]="imageH"
                                     [imageV]="imageV"
                                     [disabled]="disabled"></split-gutter-default>`
})
export class SplitGutterComponent implements AfterContentInit{

    @ViewChild("customGutter", {read: ElementRef}) customGutter: ElementRef;

    @HostBinding("style.height")
    public get height(): string {
        return this.direction === 'vertical' ? `${ this.size }px` : `100%`;
    }

    @HostBinding("style.flex-basis")
    public get flexBasis(): string {
        return `${ this.size }px`;
    }

    @HostBinding("style.transition")
    public get transition(): string {
        return this.useTransition ? `flex-basis 0.3s` : '';
    }

    @Input() set useTransition(v: boolean) {
        this._useTransition = v;
    }

    get useTransition(): boolean {
        return this._useTransition;
    }

    @HostBinding("style.order")
    @Input() public order: number;
    @Input() public direction: 'vertical' | 'horizontal';
    @Input() public size: number;
    @Input() public color: string;
    @Input() public imageH: string;
    @Input() public imageV: string;
    @Input() public disabled: boolean;

    public useDefaultGutter: boolean;
    public useCustomGutter: boolean;

    private _useTransition: boolean = false;

    constructor() {}

    public ngAfterContentInit() {
        this.useCustomGutter = this.customGutter && this.customGutter.nativeElement && (this.customGutter.nativeElement as HTMLElement).children.length > 0;
        this.useDefaultGutter = !this.useCustomGutter;
    }

}
