import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedCocktailShakerSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<any> {
        let n = items.length;
        let swapped = true;
        let start = 0;
        let end = n - 1;

        while (swapped) {
            swapped = false;
            for (let i = start; i < end; i++) {
                yield;
                if (await this.compare(items, i, i + 1)) {
                    yield;
                    await this.swap(items, i, i + 1);
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
            swapped = false;
            end--;
            for (let i = end - 1; i >= start; i--) {
                yield;
                if (await this.compare(items, i, i + 1)) {
                    yield;
                    await this.swap(items, i, i + 1);
                    swapped = true;
                }
            }
            start++;
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
        return (await this.access(items, i)).value > (await this.access(items, j)).value;
    }

    async swap(items: SortableItem[], i: number, j: number): Promise<void> {
        let temp = await this.access(items, i);
        items[i] = await this.access(items, j);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Cocktail Shaker Sort";
    }
}