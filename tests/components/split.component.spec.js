"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var split_component_1 = require("./../../src/components/split.component");
var splitArea_directive_1 = require("./../../src/components/splitArea.directive");
var splitGutter_directive_1 = require("./../../src/components/splitGutter.directive");
var TestComponent = (function () {
    function TestComponent() {
        this.areas = [
            { label: 'splitA', order: 1 },
            { label: 'splitB', order: 2 },
        ];
        this.gutterSize = 10;
    }
    TestComponent = __decorate([
        core_1.Component({
            selector: 'test',
            template: "\n      <split [gutterSize]=\"gutterSize\">\n          <split-area *ngFor=\"let area of areas\" [order]=\"area.order\">{{ area.label }}</split-area>\n      </split>"
        })
    ], TestComponent);
    return TestComponent;
}());
describe('TestComponent', function () {
    var component;
    var fixture;
    var elemAreas;
    var elemGutters;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                split_component_1.SplitComponent,
                splitArea_directive_1.SplitAreaDirective,
                splitGutter_directive_1.SplitGutterDirective,
            ],
        });
        fixture = testing_1.TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });
    it('CODE: 2 areas should have TEMPLATE: 2 areas + 1 gutter', function () {
        fixture.detectChanges();
        elemAreas = fixture.debugElement.queryAll(platform_browser_1.By.css('split-area'));
        expect(elemAreas.length).toEqual(2);
        elemGutters = fixture.debugElement.queryAll(platform_browser_1.By.css('split-gutter'));
        expect(elemGutters.length).toEqual(1);
    });
    it('CODE: 3 areas should have TEMPLATE: 3 areas + 2 gutters', function () {
        component.areas.push({ label: 'splitC', order: 3 });
        fixture.detectChanges();
        elemAreas = fixture.debugElement.queryAll(platform_browser_1.By.css('split-area'));
        expect(elemAreas.length).toEqual(3);
        elemGutters = fixture.debugElement.queryAll(platform_browser_1.By.css('split-gutter'));
        expect(elemGutters.length).toEqual(2);
    });
    it('CODE: 4 areas should have TEMPLATE: 4 areas + 3 gutters', function () {
        component.areas.push({ label: 'splitC', order: 3 });
        component.areas.shift();
        component.areas.push({ label: 'splitD', order: 4 });
        component.areas.push({ label: 'splitE', order: 5 });
        fixture.detectChanges();
        elemAreas = fixture.debugElement.queryAll(platform_browser_1.By.css('split-area'));
        expect(elemAreas.length).toEqual(4);
        elemGutters = fixture.debugElement.queryAll(platform_browser_1.By.css('split-gutter'));
        expect(elemGutters.length).toEqual(3);
    });
    // test gutterSize init = css 10px
    // test gutterSize after change = css 10px
    // test 3 areas with 1 visibility false > prop visibleAreas.length = 2
    // add new area with visibility false > prop visibleAreas.length = 2
    // toggle area visibility false > prop visibleAreas.length = 3
    // test default areas size: 3 areas -> calc( 33% - 2*gutterSize )
    // test with specific sizes
    // try to simulate mousedrag..
});
//# sourceMappingURL=split.component.spec.js.map