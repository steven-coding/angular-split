import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplitComponent } from '../components/split.component';
import { SplitAreaDirective } from '../components/split-area.directive';
import { SplitGutterDirective } from '../components/split-gutter.directive';

@NgModule({
    imports: [
        CommonModule
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
})
export class NgSplitAreasModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgSplitAreasModule,
            providers: []
        };
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: NgSplitAreasModule,
            providers: []
        };
    }

}
