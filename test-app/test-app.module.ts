import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSplitAreasModule } from "../src/modules/ng-split-areas.module";

import { TestAppComponent } from './test-app.component';
import { TestContentComponent } from "./test-content/test-content.component";
import {CustomGutterComponent} from "./custom-gutter/custom-gutter.component";

@NgModule({
    imports: [
        BrowserModule,
        NgSplitAreasModule
    ],
    declarations: [
        CustomGutterComponent,
        TestAppComponent,
        TestContentComponent
    ],
    bootstrap: [
        TestAppComponent
    ]
})
export class TestAppModule {}
