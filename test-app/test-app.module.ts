import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSplitModule } from "../src/modules/angularSplit.module";

import { TestAppComponent } from './test-app.component';
import { TestContentComponent } from "./test-content/test-content.component";

@NgModule({
    imports: [
        BrowserModule,
        AngularSplitModule
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
