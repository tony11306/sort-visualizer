import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedRadixSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<any> {
        let max = Math.max(...items.map(item => item.value));
        let exp = 1;
        while (Math.floor(max / exp) > 0) {
            yield* this.countingSort(items, exp);
            exp *= 10;
        }
        yield;
        await this.visualizedSortingAlgorithmOuput.onFinished(items);
    }

    async* countingSort(items: SortableItem[], exp: number): AsyncGenerator<any> {
        let n = items.length;
        let output = items.slice();
        let count = new Array<number>(10).fill(0);
        yield;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(output);

        for (let i = 0; i < n; i++) {
            yield;
            count[Math.floor(items[i].value / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {
            yield;
            count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
            let index = Math.floor(items[i].value / exp) % 10;
            output[count[index] - 1] = items[i];
            yield;
            await this.visualizedSortingAlgorithmOuput.onAccess(output, count[index] - 1);
            count[index]--;
        }

        for (let i = 0; i < n; i++) {
            items[i] = output[i];
            yield;
            await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
        }
    }

    async access(items: SortableItem[], i: number): Promise<SortableItem> {
        await this.visualizedSortingAlgorithmOuput.onAccess(items, i);
        return items[i];
    }

    async compare(items: SortableItem[], i: number, j: number): Promise<boolean> {
        await this.visualizedSortingAlgorithmOuput.onCompare(items, i, j);
        return (await this.access(items, i)).value > (await this.access(items, j)).value;
    }

    async swap(items: SortableItem[], i: number, j: number): Promise<void> {
        let temp = await this.access(items, i);
        items[i] = await this.access(items, j);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Radix Sort";
    }
}