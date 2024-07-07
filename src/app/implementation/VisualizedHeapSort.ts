import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedHeapSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<any> {
        let n = items.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            yield* this.heapify(items, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            yield;
            await this.swap(items, 0, i);
            yield* this.heapify(items, i, 0);
        }

        yield;
        await this.visualizedSortingAlgorithmOuput.onFinished(items);
    }

    async* heapify(items: SortableItem[], n: number, i: number): AsyncGenerator<any> {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < n && await this.compare(items, l, largest)) {
            largest = l;
        }

        if (r < n && await this.compare(items, r, largest)) {
            largest = r;
        }

        if (largest !== i) {
            yield;
            await this.swap(items, i, largest);
            yield* this.heapify(items, n, largest);
        }
    }

    async access(items: SortableItem[], i: number): Promise<SortableItem> {
        await this.visualizedSortingAlgorithmOuput.onAccess(items, i);
        return items[i];
    }

    async compare(items: SortableItem[], j: number, key: number | SortableItem): Promise<boolean> {
        if (typeof key === 'number') {
            await this.visualizedSortingAlgorithmOuput.onCompare(items, j, key);
            return items[j].value > items[key].value;
        }

        return items[j].value > key.value;
    }

    async swap(items: SortableItem[], i: number, j: number): Promise<void> {
        let temp = await this.access(items, i);
        items[i] = await this.access(items, j);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Heap Sort";
    }
}