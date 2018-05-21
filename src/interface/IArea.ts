import { SplitAreaDirective } from "../components/splitArea.directive";

export interface IArea {
    comp: SplitAreaDirective;
    size: number;
    minSizePx?: number;
    useMinPxSize?: boolean;
    order: number;
}
