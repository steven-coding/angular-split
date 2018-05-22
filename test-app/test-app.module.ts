import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSplitAreasModule } from "../src/modules/ng-split-areas.module";

import { TestAppComponent } from './test-app.component';
import { TestContentComponent } from "./test-content/test-content.component";

@NgModule({
    imports: [
        BrowserModule,
        NgSplitAreasModule
    ],
    declarations: [
        TestAppComponent,
        TestContentComponent
    ],
    bootstrap: [
        TestAppComponent
    ]
})
export class TestAppModule {}
