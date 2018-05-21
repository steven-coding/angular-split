"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var split_component_1 = require("./split.component");
var SplitAreaDirective = (function () {
    function SplitAreaDirective(ngZone, elRef, renderer, split) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.renderer = renderer;
        this.split = split;
        this._order = null;
        ////
        this._size = null;
        ////
        this._minSize = 0;
        ////
        this._visible = true;
        this.lockListeners = [];
    }
    Object.defineProperty(SplitAreaDirective.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (v) {
            v = Number(v);
            this._order = !isNaN(v) ? v : null;
            this.split.updateArea(this, true, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (v) {
            v = Number(v);
            this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v / 100) : null;
            this.split.updateArea(this, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "minSize", {
        get: function () {
            return this._minSize;
        },
        set: function (v) {
            v = Number(v);
            this._minSize = (!isNaN(v) && v > 0 && v < 100) ? v / 100 : 0;
            this.split.updateArea(this, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "minSizePx", {
        get: function () {
            return this._minSizePx;
        },
        /**
         * minimum size (in pixels) of the splitArea
         */
        set: function (v) {
            console.log("set minWidthPx", v);
            this._minSizePx = v;
            this.split.updateArea(this, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitAreaDirective.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (v) {
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
    SplitAreaDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.split.addArea(this);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', '0');
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', '0');
        this.ngZone.runOutsideAngular(function () {
            _this.transitionListener = _this.renderer.listen(_this.elRef.nativeElement, 'transitionend', function (e) { return _this.onTransitionEnd(e); });
        });
    };
    SplitAreaDirective.prototype.getSizePixel = function (prop) {
        return this.elRef.nativeElement[prop];
    };
    SplitAreaDirective.prototype.setStyleVisibleAndDir = function (isVisible, isDragging, direction) {
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
    SplitAreaDirective.prototype.setStyleOrder = function (value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    };
    SplitAreaDirective.prototype.setStyleFlexbasis = function (value, isDragging, direction) {
        // If component not yet initialized or gutter being dragged, disable transition
        if (this.split.isViewInitialized === false || isDragging === true) {
            this.setStyleTransition(false);
        }
        else {
            this.setStyleTransition(this.split.useTransition);
        }
        if (direction === 'horizontal') {
            this.renderer.removeStyle(this.elRef.nativeElement, "width");
        }
        else {
            this.renderer.removeStyle(this.elRef.nativeElement, "height");
        }
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', value);
    };
    SplitAreaDirective.prototype.setSizePx = function (value, direction) {
        this.renderer.removeStyle(this.elRef.nativeElement, 'flex-basis');
        if (direction === 'horizontal') {
            this.renderer.setStyle(this.elRef.nativeElement, "width", value + "px");
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, "height", value + "px");
        }
    };
    SplitAreaDirective.prototype.setStyleTransition = function (useTransition) {
        if (useTransition) {
            this.renderer.setStyle(this.elRef.nativeElement, 'transition', "flex-basis 0.3s");
        }
        else {
            this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
        }
    };
    SplitAreaDirective.prototype.onTransitionEnd = function (event) {
        // Limit only flex-basis transition to trigger the event
        if (event.propertyName === 'flex-basis') {
            this.split.notify('transitionEnd');
        }
    };
    SplitAreaDirective.prototype.lockEvents = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'selectstart', function (e) { return false; }));
            _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'dragstart', function (e) { return false; }));
        });
    };
    SplitAreaDirective.prototype.unlockEvents = function () {
        while (this.lockListeners.length > 0) {
            var fct = this.lockListeners.pop();
            if (fct) {
                fct();
            }
        }
    };
    SplitAreaDirective.prototype.ngOnDestroy = function () {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SplitAreaDirective.prototype, "order", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SplitAreaDirective.prototype, "size", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SplitAreaDirective.prototype, "minSize", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SplitAreaDirective.prototype, "minSizePx", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], SplitAreaDirective.prototype, "visible", null);
    SplitAreaDirective = __decorate([
        core_1.Directive({
            selector: 'split-area'
        }),
        __metadata("design:paramtypes", [core_1.NgZone,
            core_1.ElementRef,
            core_1.Renderer2,
            split_component_1.SplitComponent])
    ], SplitAreaDirective);
    return SplitAreaDirective;
}());
exports.SplitAreaDirective = SplitAreaDirective;
//# sourceMappingURL=splitArea.directive.js.map