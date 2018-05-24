import {Component} from '@angular/core';
import {IArea} from "../src/interface/IArea";

@Component({
    moduleId: module.id,
    selector: 'test-app',
    styleUrls: ['test-app.component.css'],
    templateUrl: 'test-app.component.html'
})
export class TestAppComponent {
    public areas: IArea[] = <any[]>[
        { minSizePx: 500, maxSizePx: 700 }, {}
    ];

    public handleAreaSizeChange(event: {areaIdx: number, size: number}) {
        this.areas[event.areaIdx].size = event.size;
    }
}