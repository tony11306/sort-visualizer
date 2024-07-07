import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedInsertionSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<void> {
        let n = items.length;
        for (let i = 1; i < n; i++) {
            yield;
            let key = await this.access(items, i);
            let j = i - 1;
            yield;
            while (j >= 0 && await this.compare(items, j, key)) {
                yield;
                items[j + 1] = await this.access(items, j);
                
                yield;
                await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
                j--;
            }
            items[j + 1] = key;
        }
        yield;
        await this.visualizedSortingAlgorithmOuput.onFinished(items);
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
        return "Insertion Sort";
    }
}