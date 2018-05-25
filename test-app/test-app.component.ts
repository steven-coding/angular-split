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
        { minSizePx: 500, maxSizePx: 700 },
        { minSizePx: 250 }
    ];

    public getAreaByOrder(order: number): IArea {
        return this.areas.find((a) => a.order === order) as IArea;
    }

    public handleAreaSizeChange(event: {areaOrder: number, size: number}) {
        const area = this.getAreaByOrder(event.areaOrder);

        if (area) {
            area.size = event.size;
        }
    }
}
