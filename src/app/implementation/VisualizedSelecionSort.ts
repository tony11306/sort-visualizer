import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedSelecionSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<void> {
        let n = items.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                yield;
                if (await this.compare(items, j, minIndex)) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                yield;
                await this.swap(items, i, minIndex);
            }
        }
        yield;
        await this.visualizedSortingAlgorithmOuput.onFinished(items);
    }

    async access(items: SortableItem[], i: number): Promise<SortableItem> {
        await this.visualizedSortingAlgorithmOuput.onAccess(items, i);
        return items[i];
    }

    async compare(items: SortableItem[], i: number, j: number): Promise<boolean> {
        await this.visualizedSortingAlgorithmOuput.onCompare(items, i, j);
        return (await this.access(items, i)).value < (await this.access(items, j)).value;
    }

    async swap(items: SortableItem[], i: number, j: number): Promise<void> {
        let temp = await this.access(items, i);
        items[i] = await this.access(items, j);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Selection Sort";
    }
}