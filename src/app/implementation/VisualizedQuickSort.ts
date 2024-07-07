import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedQuickSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<any> {
        yield* this.quickSort(items, 0, items.length - 1);
        yield;
        await this.visualizedSortingAlgorithmOuput.onFinished(items);
    }

    async* quickSort(items: SortableItem[], low: number, high: number): AsyncGenerator<number> {
        if (low < high) {
            let pi = -1;
            for await (pi of this.partition(items, low, high)) {
                yield -1;
            }
            yield* this.quickSort(items, low, pi - 1);
            yield* this.quickSort(items, pi + 1, high);
        }
    }

    async* partition(items: SortableItem[], low: number, high: number): AsyncGenerator<number> {
        yield -1;
        let pivot = await this.access(items, high);
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield -1;
            if (await this.compare(items, j, pivot)) {
                i++;
                yield -1;
                await this.swap(items, i, j);
            }
        }
        yield -1;
        await this.swap(items, i + 1, high);
        yield i + 1;
    }

    async access(items: SortableItem[], i: number): Promise<SortableItem> {
        await this.visualizedSortingAlgorithmOuput.onAccess(items, i);
        return items[i];
    }

    async compare(items: SortableItem[], j: number, key: number | SortableItem): Promise<boolean> {
        if (typeof key === 'number') {
            await this.visualizedSortingAlgorithmOuput.onCompare(items, j, key);
            return items[j].value < items[key].value;
        }

        return items[j].value < key.value;
    }

    async swap(items: SortableItem[], i: number, j: number): Promise<void> {
        let temp = await this.access(items, i);
        items[i] = await this.access(items, j);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Quick Sort";
    }

}