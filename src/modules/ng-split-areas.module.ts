import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplitComponent } from '../components/split.component';
import { SplitAreaDirective } from '../components/split-area.directive';
import { SplitGutterComponent } from '../components/split-gutter.component';
import { SplitGutterDefaultDirective } from "../components/split-gutter-default.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SplitComponent,
        SplitAreaDirective,
        SplitGutterComponent,
        SplitGutterDefaultDirective
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
