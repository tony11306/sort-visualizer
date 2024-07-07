interface VisualizedSortingAlgorithm {
    visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput;
    sort(items: SortableItem[]): AsyncGenerator<any>;
    access(items: SortableItem[], i: number): Promise<SortableItem>;
    compare(items: SortableItem[], i: number | SortableItem, j: number | SortableItem): Promise<boolean>;
    swap(items: SortableItem[], i: number, j: number): Promise<void>;
    getAlgorithmName(): string;
}

interface VisualizedSortingAlgorithmOuput {
    onCompare(items: SortableItem[], i: number, j: number): Promise<void>;
    onAccess(items: SortableItem[], i: number): Promise<void>;
    onValueChanged(items: SortableItem[]): Promise<void>;
    onFinished(items: SortableItem[]): Promise<void>;
}

export type { VisualizedSortingAlgorithm, VisualizedSortingAlgorithmOuput };