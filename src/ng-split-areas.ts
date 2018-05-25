// Public classes.
import {AreaSizeCalculation} from "./components/calculation/area-size-calculation";
import {IAreaSizeCalculation} from "./interface/calculation/IAreaSizeCalculation";

export { NgSplitAreasModule } from './modules/ng-split-areas.module';
export { SplitComponent } from './components/split.component';
export { SplitAreaDirective } from './components/split-area.directive';

export const MIN_MAX_SIZE_CALCULATION: IAreaSizeCalculation = new AreaSizeCalculation();