import { SplitAreaDirective } from "../components/split-area.directive";

export interface IArea {
    comp: SplitAreaDirective;
    size: number;
    minSizePx?: number;
    order: number;
}
