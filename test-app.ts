import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TestAppModule } from './test-app/test-app.module';

platformBrowserDynamic().bootstrapModule(TestAppModule);
