import {IArea} from "../../interface/IArea";
import {SplitAreaDirective} from "../split-area.directive";
import {EventEmitter} from "@angular/core";

/**
 * Handles and notifies size changes
 */
export class Area implements IArea {

    sizeChanged = new EventEmitter<number>();

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        let previousValue: number = this._size;
        this._size = value;

        if(previousValue !== value) {
            this.sizeChanged.next(value);
        }
    }
    comp?: SplitAreaDirective;
    maxSizePx?: number;
    minSizePx?: number;
    order: number;

    private _size: number;

    constructor(area?: IArea) {
        if(!area) {
            return;
        }

        this._size = area.size;
        this.comp = area.comp;
        this.maxSizePx = area.maxSizePx;
        this.minSizePx = area.minSizePx;
        this.order = area.order;
    }
}