"use client";
import { useState, useEffect, useRef, useCallback, MutableRefObject } from "react";
import Select from "react-select";
import { VisualizedSortingAlgorithmOuput, VisualizedSortingAlgorithm } from "../interface/VisualizedSortingAlgorithm";
import { VisualizedBubbleSort } from "../implementation/VisualizedBubbleSort";
import { VisualizedInsertionSort } from "../implementation/VisualizedInsertionSort";
import { VisualizedQuickSort } from "../implementation/VisualizedQuickSort";
import { VisualizedMergeSort } from "../implementation/VisualizedMergeSort";
import { VisualizedHeapSort } from "../implementation/VisualizedHeapSort";
import { VisualizedSelecionSort } from "../implementation/VisualizedSelecionSort";
import { VisualizedRadixSort } from "../implementation/VisualizedRadixSort";
import { VisualizedCocktailShakerSort } from "../implementation/VisualizedCocktailShakerSort";
import { Button, Slider, Typography } from "@mui/material";

enum SortState {
    RUNNING,
    PAUSED,
    INITIALIZED
}

export function SortVisualizer() {
    const DELAY_PER_SPEED = 0.2;
    const MAX_SPEED = 100;
    const audioContextRef: MutableRefObject<AudioContext | null> = useRef(null);
    const visualizedSortingAlgorithmOuput: VisualizedSortingAlgorithmOuput = {
        onCompare: async (items, i, j) => {await handleItemEvent(items, [i, j], "red", false)},
        onAccess: async (items, i) => await handleItemEvent(items, [i], "green", true),
        onFinished: async (items) => {
            for (let i = 0; i < items.length; i++) {
                await handleItemEvent(items, [i], "blue", true);
            }
            resetColors(items);
        },
        onValueChanged: async (items) => setItems([...items])
    };
    const sortingAlgorithms: VisualizedSortingAlgorithm[] = [
        new VisualizedBubbleSort(visualizedSortingAlgorithmOuput),
        new VisualizedInsertionSort(visualizedSortingAlgorithmOuput),
        new VisualizedQuickSort(visualizedSortingAlgorithmOuput),
        new VisualizedMergeSort(visualizedSortingAlgorithmOuput),
        new VisualizedHeapSort(visualizedSortingAlgorithmOuput),
        new VisualizedSelecionSort(visualizedSortingAlgorithmOuput),
        new VisualizedRadixSort(visualizedSortingAlgorithmOuput),
        new VisualizedCocktailShakerSort(visualizedSortingAlgorithmOuput)
    ];
    
    const [itemCount, setItemCount] = useState<number>(50);
    const [algorithmState, setAlgorithmState] = useState<SortState>(SortState.INITIALIZED);
    const algorithmStateRef = useRef(algorithmState);
    const [items, setItems] = useState<SortableItem[]>([]);
    const [currentSortingAlgorithm, setCurrentSortingAlgorithm] = useState<VisualizedSortingAlgorithm>(sortingAlgorithms[0]);

    const [speed, setSpeed] = useState<number>(50);
    const speedRef = useRef(speed);

    const runCurrentAlgorithm = async () => {
        setAlgorithmState(SortState.RUNNING);
        const generator = currentSortingAlgorithm.sort(items);
        let result = await generator.next();
        while (!result.done) {
            if (algorithmStateRef.current === SortState.INITIALIZED) {
                break;
            } else if (algorithmStateRef.current === SortState.PAUSED) {
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                result = await generator.next();
            }
        }
        setAlgorithmState(SortState.INITIALIZED);
    }
    
    useEffect(() => {
        resetItems();
        audioContextRef.current = new AudioContext();
    }, []);

    useEffect(() => {
        algorithmStateRef.current = algorithmState;
    }, [algorithmState]);

    useEffect(() => {
        setAlgorithmState(SortState.INITIALIZED);
    }, [currentSortingAlgorithm]);

    useEffect(() => {
        speedRef.current = MAX_SPEED - speed;
    }, [speed]);

    useEffect(() => {
        resetItems();
    }, [itemCount]);


    const calculateDelay = useCallback((speed: number) => speed * DELAY_PER_SPEED, []);
    const resetItems = useCallback(() => {
        const newItems = Array.from({ length: itemCount }, (_, i) => ({
            value: (i + 1) * 2
        })).sort(() => Math.random() - 0.5);

        setItems(newItems);
        setAlgorithmState(SortState.INITIALIZED);
    }, [itemCount]);

    const handleItemEvent = async (items: SortableItem[], indices: number[], color: string, playSound: boolean) => {
        const delay = calculateDelay(speedRef.current);
        if (playSound) {
            await makeSoundBasedOnValue(items[indices[0]].value);
        }

        const newItems = items.map((item, index) => indices.includes(index) ? { ...item, color } : item);
        setItems(newItems);
        await new Promise(resolve => setTimeout(resolve, delay));

        const resetItems = items.map(item => ({ ...item, color: undefined }));
        setItems(resetItems);
        await new Promise(resolve => setTimeout(resolve, delay));
    };

    const resetColors = (items: SortableItem[]) => {
        const resetItems = items.map(item => ({ ...item, color: undefined }));
        setItems(resetItems);
    };

    const pause = () => {
        setAlgorithmState(SortState.PAUSED);
    }

    const resume = () => {
        setAlgorithmState(SortState.RUNNING);
    }

    const makeSoundBasedOnValue = async (value: number) => {
        const oscillator = audioContextRef!.current!.createOscillator();
        const gainNode = audioContextRef!.current!.createGain();
        gainNode.gain.value = 0.007;
        oscillator.type = "square";
        oscillator.frequency.value = 200 + value * 2;
        oscillator.connect(gainNode).connect(audioContextRef!.current!.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
    };

    return (
        <div>
            <h1>Sort Visualizer</h1>
            <div>

                <Select
                    options={sortingAlgorithms.map(algorithm => ({ label: algorithm.getAlgorithmName(), value: algorithm }))}
                    onChange={(selectedOption) => setCurrentSortingAlgorithm(selectedOption!.value)}
                    value={{ label: currentSortingAlgorithm.getAlgorithmName(), value: currentSortingAlgorithm }}
                    isDisabled={algorithmState === SortState.RUNNING}
                />
                {
                    algorithmState === SortState.INITIALIZED ? (
                        <Button variant="contained" onClick={runCurrentAlgorithm}>Start</Button>
                    ) : algorithmState === SortState.RUNNING ? (
                        <Button variant="contained" onClick={pause} color="error">Pause</Button>
                    ) : (
                        <Button variant="contained" onClick={resume}>Resume</Button>
                    )
                }
                <Button variant="contained" onClick={resetItems} disabled={algorithmState === SortState.RUNNING}>Reset</Button>
                <Typography id="speed-slider" gutterBottom>
                    Speed
                </Typography>
                <Slider
                    aria-labelledby="speed-slider"
                    value={speed}
                    onChange={(event, newValue) => setSpeed(newValue as number)}
                    min={1}
                    max={MAX_SPEED}
                    valueLabelDisplay="auto"
                />

                <Typography id="item-count-slider" gutterBottom>
                    Item Count
                </Typography>
                <Slider
                    aria-labelledby="item-count-slider"
                    value={itemCount}
                    onChange={(event, newValue) => setItemCount(newValue as number)}
                    min={1}
                    max={200}
                    valueLabelDisplay="auto"
                    disabled={algorithmState === SortState.RUNNING}
                />

            </div>
            <div style={{ display: "flex", marginTop: "20px" }}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            height: `${item.value * 1}px`,
                            width: "100%",
                            margin: "0px",
                            backgroundColor: item.color || "grey",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
