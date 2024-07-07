import { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput } from "../interface/VisualizedSortingAlgorithm";

export class VisualizedMergeSort implements VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;

    constructor(VisualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput) {
        this.visualizedSortingAlgorithmOuput = VisualizedSortingAlgorithmOuput;
    }

    async* sort(items: SortableItem[]): AsyncGenerator<any> {
        yield* this.mergeSort(items, 0, items.length);
        yield;
        await this.visualizedSortingAlgorithmOuput.onFinished(items);
    }

    async* mergeSort(items: SortableItem[], left: number, right: number): AsyncGenerator<any> {
        if (left + 1 < right) {
            let mid = Math.floor((left + right) / 2);
            yield* this.mergeSort(items, left, mid); // left closed, mid open
            yield* this.mergeSort(items, mid, right); // mid closed, right open
            yield* this.merge(items, left, mid, right);
        }
    }

    async* merge(items: SortableItem[], left: number, mid: number, right: number): AsyncGenerator<any> {

        let tempArr = new Array(right - left + 1);

        let i = left;
        let j = mid;
        let k = 0;

        while (i < mid && j < right) {
            yield;
            if (await this.compare(items, i, j)) {
                yield;
                tempArr[k] = await this.access(items, i);
                i++;
            } else {
                yield;
                tempArr[k] = await this.access(items, j);
                j++;
            }
            k++;
        }

        while (i < mid) {
            yield;
            tempArr[k] = await this.access(items, i);
            i++;
            k++;
        }

        while (j < right) {
            yield;
            tempArr[k] = await this.access(items, j);
            j++;
            k++;
        }

        console.log(tempArr.map(item => item.value));
        for (let i = 0; i < k; i++) {
            items[left + i] = tempArr[i];
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
        return items[i].value < items[j].value;
    }

    async swap(items: SortableItem[], i: number, j: number): Promise<void> {
        let temp = await this.access(items, i);
        items[i] = await this.access(items, j);
        items[j] = temp;
        await this.visualizedSortingAlgorithmOuput.onValueChanged(items);
    }

    getAlgorithmName(): string {
        return "Merge Sort";
    }
}