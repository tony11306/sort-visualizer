import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedBubbleSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<void> {
        let n = items.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                yield;
                if (await this.compare(items, j, j + 1)) {
                    yield
                    await this.swap(items, j, j + 1);
                }
            }
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
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Bubble Sort";
    }
}