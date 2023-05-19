import { createSignal } from "solid-js";
import { Button } from "@suid/material";
import { behaviorTable } from "../../lib/transitionTables";

const COLUMN_COUNT = 20;
const ROW_COUNT = 14;

const getNeighbors = (i: number, j: number, state: () => number[][]) => {
	const neighbors = [
		state()[(i - 1 + ROW_COUNT) % ROW_COUNT][
			(j - 1 + COLUMN_COUNT) % COLUMN_COUNT
		],
		state()[(i - 1 + ROW_COUNT) % ROW_COUNT][j],
		state()[(i - 1 + ROW_COUNT) % ROW_COUNT][(j + 1) % COLUMN_COUNT],
		state()[i][(j - 1 + COLUMN_COUNT) % COLUMN_COUNT],
		state()[i][(j + 1) % COLUMN_COUNT],
		state()[(i + 1) % ROW_COUNT][(j - 1 + COLUMN_COUNT) % COLUMN_COUNT],
		state()[(i + 1) % ROW_COUNT][j],
		state()[(i + 1) % ROW_COUNT][(j + 1) % COLUMN_COUNT],
	];
	return neighbors;
};

const generateNeighborStateString = (neighbors: number[]) => {
	const neighborState = [] as number[];
	neighbors.forEach((neighbor) => {
		neighborState[neighbor]
			? neighborState[neighbor]++
			: (neighborState[neighbor] = 1);
	});
	const neighborStateString = neighborState.join("");
	return neighborStateString;
};

export default function Board() {
	const [state, setState] = createSignal<number[][]>(
		Array.from(Array(ROW_COUNT).keys()).map((k) =>
			Array.from(Array(COLUMN_COUNT).keys()).map((k) =>
				Math.round(Math.random())
			)
		)
	);

	return (
		<div class="">
			<div class="p-5 flex justify-center">
				<button
					aria-label="clear"
					class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
					onClick={() =>
						setState(
							Array.from(Array(ROW_COUNT).keys()).map((k) =>
								Array.from(Array(COLUMN_COUNT).keys()).map(
									(k) => 0
								)
							)
						)
					}
				>
					Clear
				</button>
				<button
					aria-label="randomize"
					class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
					onClick={() =>
						setState(
							Array.from(Array(ROW_COUNT).keys()).map((k) =>
								Array.from(Array(COLUMN_COUNT).keys()).map(
									(k) => Math.round(Math.random())
								)
							)
						)
					}
				>
					Randomize
				</button>
				<button
					aria-label="update state"
					class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
					onClick={() => {
						const newState = [...state()];
						for (let i = 0; i < ROW_COUNT; i++) {
							for (let j = 0; j < COLUMN_COUNT; j++) {
								const neighborStateString =
									generateNeighborStateString(
										getNeighbors(i, j, state)
									);
								// console.log(neighborStateString);

								newState[i][j] =
									behaviorTable["gol"][state()[i][j]]
										.transitions[neighborStateString] ||
									behaviorTable["gol"][state()[i][j]].default;
							}
						}
						console.log(newState);
						setState(newState);
					}}
				>
					Update State
				</button>
			</div>
			<div class="p-5 flex justify-center">
				<div aria-label="board">
					{state().map((row, rowIndex) => (
						<div class="block overflow-hidden p-0">
							{row.map((value, colIndex) => (
								<div
									class={`${behaviorTable["gol"][value].color} p-0 m-0 rounded-md w-10 h-10 inline-block float-left clear-none`}
									aria-label="cell"
									onClick={() => {
										const newState = [...state()];
										newState[rowIndex][colIndex] = state()[
											rowIndex
										][colIndex]
											? 0
											: 1;
										setState(newState);
									}}
								>
									{/* <span>{`(${rowIndex}, ${colIndex})`}</span> */}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
