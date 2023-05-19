import { createSignal } from "solid-js";
import { ToggleButton } from "@suid/material";

const COLUMN_COUNT = 20;
const ROW_COUNT = 14;

export default function Board() {
	const [state, setState] = createSignal<number[][]>(
		Array.from(Array(ROW_COUNT).keys()).map((k) =>
			Array.from(Array(COLUMN_COUNT).keys()).map((k) =>
				Math.round(Math.random())
			)
		)
	);

	const transitionTable = {
		"5_3": (value: number) => 1,
		"6_2": (value: number) => (value ? 1 : 0),
	};

	const updateState = (
		state: number[][],
		transitionTable: Record<string, (value: number) => number>
	) => {
		const newState = state.map((row, rowIndex) =>
			row.map((value, colIndex) => {
				const neighbors = [
					state[rowIndex - 1]?.[colIndex - 1],
					state[rowIndex - 1]?.[colIndex],
					state[rowIndex - 1]?.[colIndex + 1],
					state[rowIndex]?.[colIndex - 1],
					state[rowIndex]?.[colIndex + 1],
					state[rowIndex + 1]?.[colIndex - 1],
					state[rowIndex + 1]?.[colIndex],
					state[rowIndex + 1]?.[colIndex + 1],
				];

				const neighborStateCounts = neighbors.reduce(
					(acc, neighbor) => {
						acc[neighbor] = acc[neighbor] + 1;
						return acc;
					},
					[] as number[]
				);

				const stateId = neighbors.join("_");

				return transitionTable?.[stateId]?.(value) || 0;
			})
		);

		setState(newState);
		console.log(`Updated State ${JSON.stringify(newState)}`);
	};

	setTimeout(() => {
		updateState(state(), transitionTable);
	}, 1000);

	return (
		<div>
			<div class="p-5">
				{state().map((row, rowIndex) => (
					<div class="p-1 justify-evenly">
						{row.map((value, colIndex) => (
							<span class="p-1">
								<ToggleButton
									aria-label="cell"
									value={value}
									color={state()}
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
									<span>{`(${rowIndex}, ${colIndex})`}</span>
								</ToggleButton>
							</span>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
