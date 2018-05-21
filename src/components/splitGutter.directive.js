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
var SplitGutterDirective = (function () {
    ////
    function SplitGutterDirective(elRef, renderer) {
        this.elRef = elRef;
        this.renderer = renderer;
        ////
        this._disabled = false;
    }
    Object.defineProperty(SplitGutterDirective.prototype, "order", {
        set: function (v) {
            this.renderer.setStyle(this.elRef.nativeElement, 'order', v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (v) {
            this._direction = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "useTransition", {
        ////
        set: function (v) {
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
        get: function () {
            return this._size;
        },
        set: function (v) {
            this._size = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            this._color = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "imageH", {
        get: function () {
            return this._imageH;
        },
        set: function (v) {
            this._imageH = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "imageV", {
        get: function () {
            return this._imageV;
        },
        set: function (v) {
            this._imageV = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SplitGutterDirective.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (v) {
            this._disabled = v;
            this.refreshStyle();
        },
        enumerable: true,
        configurable: true
    });
    SplitGutterDirective.prototype.refreshStyle = function () {
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', this.size + "px");
        // fix safari bug about gutter height when direction is horizontal
        this.renderer.setStyle(this.elRef.nativeElement, 'height', (this.direction === 'vertical') ? this.size + "px" : "100%");
        this.renderer.setStyle(this.elRef.nativeElement, 'background-color', (this.color !== '') ? this.color : "#eeeeee");
        var state = (this.disabled === true) ? 'disabled' : this.direction;
        this.renderer.setStyle(this.elRef.nativeElement, 'background-image', this.getImage(state));
        this.renderer.setStyle(this.elRef.nativeElement, 'cursor', this.getCursor(state));
    };
    SplitGutterDirective.prototype.getCursor = function (state) {
        switch (state) {
            case 'horizontal':
                return 'col-resize';
            case 'vertical':
                return 'row-resize';
            case 'disabled':
                return 'default';
        }
    };
    SplitGutterDirective.prototype.getImage = function (state) {
        switch (state) {
            case 'horizontal':
                return (this.imageH !== '') ? this.imageH : defaultImageH;
            case 'vertical':
                return (this.imageV !== '') ? this.imageV : defaultImageV;
            case 'disabled':
                return '';
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SplitGutterDirective.prototype, "order", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SplitGutterDirective.prototype, "direction", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], SplitGutterDirective.prototype, "useTransition", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SplitGutterDirective.prototype, "size", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SplitGutterDirective.prototype, "color", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SplitGutterDirective.prototype, "imageH", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SplitGutterDirective.prototype, "imageV", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], SplitGutterDirective.prototype, "disabled", null);
    SplitGutterDirective = __decorate([
        core_1.Directive({
            selector: 'split-gutter'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.Renderer2])
    ], SplitGutterDirective);
    return SplitGutterDirective;
}());
exports.SplitGutterDirective = SplitGutterDirective;
var defaultImageH = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==")';
var defaultImageV = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC")';
//# sourceMappingURL=splitGutter.directive.js.map