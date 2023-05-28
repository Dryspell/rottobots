import { Accessor, Setter, createSignal } from "solid-js";
import { behaviorTable } from "../../lib/transitionTables";

const getNeighbors = (
	i: number,
	j: number,
	state: () => number[][],
	toroidal: boolean
) => {
	const ROW_COUNT = state().length;
	const COLUMN_COUNT = state()[0].length;

	const neighbors = toroidal
		? [
				state()[(i - 1 + ROW_COUNT) % ROW_COUNT][
					(j - 1 + COLUMN_COUNT) % COLUMN_COUNT
				],
				state()[(i - 1 + ROW_COUNT) % ROW_COUNT][j],
				state()[(i - 1 + ROW_COUNT) % ROW_COUNT][
					(j + 1) % COLUMN_COUNT
				],
				state()[i][(j - 1 + COLUMN_COUNT) % COLUMN_COUNT],
				state()[i][(j + 1) % COLUMN_COUNT],
				state()[(i + 1) % ROW_COUNT][
					(j - 1 + COLUMN_COUNT) % COLUMN_COUNT
				],
				state()[(i + 1) % ROW_COUNT][j],
				state()[(i + 1) % ROW_COUNT][(j + 1) % COLUMN_COUNT],
		  ]
		: [
				state()[i - 1]?.[j - 1],
				state()[i - 1]?.[j],
				state()[i - 1]?.[j + 1],
				state()[i]?.[j - 1],
				state()[i]?.[j + 1],
				state()[i + 1]?.[j - 1],
				state()[i + 1]?.[j],
				state()[i + 1]?.[j + 1],
		  ].map((neighbor) => neighbor ?? 0);
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

const emptyMatrix = (rows: number, cols: number) =>
	Array.from(Array(rows).keys()).map(() =>
		Array.from(Array(cols).keys()).map(() => 0)
	);

const ClearButton = (props: {
	setState: Setter<number[][]>;
	boardConfigs: Accessor<BoardConfigs>;
}) => {
	return (
		<button
			aria-label="clear"
			class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
			onClick={() =>
				props.setState(
					emptyMatrix(
						props.boardConfigs().rowCount,
						props.boardConfigs().columnCount
					)
				)
			}
		>
			Clear
		</button>
	);
};

const RandomizeButton = (props: {
	setState: Setter<number[][]>;
	boardConfigs: Accessor<BoardConfigs>;
}) => (
	<button
		aria-label="randomize"
		class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
		onClick={() =>
			props.setState(
				Array.from(Array(props.boardConfigs().rowCount).keys()).map(
					(k) =>
						Array.from(
							Array(props.boardConfigs().columnCount).keys()
						).map((k) => Math.round(Math.random()))
				)
			)
		}
	>
		Randomize
	</button>
);

const UpdateButton = (props: {
	state: Accessor<number[][]>;
	setState: Setter<number[][]>;
	boardConfigs: Accessor<BoardConfigs>;
}) => (
	<button
		aria-label="update state"
		class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
		onClick={() => {
			console.log(`----- UPDATE STATE -----`);

			const newState = emptyMatrix(
				props.boardConfigs().rowCount,
				props.boardConfigs().columnCount
			);
			for (let ri = 0; ri < props.boardConfigs().rowCount; ri++) {
				for (let ci = 0; ci < props.boardConfigs().columnCount; ci++) {
					const neighborStateString = generateNeighborStateString(
						getNeighbors(
							ri,
							ci,
							props.state,
							props.boardConfigs().toroidal
						)
					);

					const newLocalState =
						behaviorTable["gol"][props.state()[ri][ci]].transitions[
							neighborStateString
						] ??
						behaviorTable["gol"][props.state()[ri][ci]].default;

					newState[ri][ci] = newLocalState;

					// state()[ri][ci] &&
					console.log(
						`(${ri}, ${ci}): ${generateNeighborStateString(
							getNeighbors(
								ri,
								ci,
								props.state,
								props.boardConfigs().toroidal
							)
						)}, newLocalState: ${newLocalState}`
					);
				}
			}

			console.log(newState);
			props.setState(newState);
		}}
	>
		Update State
	</button>
);

type BoardConfigs = {
	columnCount: number;
	rowCount: number;
	toroidal: boolean;
};

export default function Board() {
	const [boardConfigs, setBoardConfigs] = createSignal({
		columnCount: 20,
		rowCount: 20,
		toroidal: false,
	});

	const [state, setState] = createSignal<number[][]>(
		Array.from(Array(boardConfigs().rowCount).keys()).map((k) =>
			Array.from(Array(boardConfigs().columnCount).keys()).map((k) =>
				Math.round(Math.random())
			)
		)
	);

	return (
		<div class="">
			<div class="p-5 flex justify-center">
				<ClearButton setState={setState} boardConfigs={boardConfigs} />
				<RandomizeButton
					setState={setState}
					boardConfigs={boardConfigs}
				/>
				<UpdateButton
					state={state}
					setState={setState}
					boardConfigs={boardConfigs}
				/>
			</div>

			<div class="p-5 flex justify-center">
				<input
					type="range"
					min="0"
					max="40"
					value={boardConfigs().rowCount}
					class="range-primary h-10 w-96 px-2"
					onInput={(e) => {
						console.log(e.target.value);
						setBoardConfigs({
							...boardConfigs(),
							columnCount: parseInt(e.target.value),
							rowCount: parseInt(e.target.value),
						});
					}}
				/>
				<span class="text-2xl px-2">{boardConfigs().rowCount}</span>
			</div>

			<div class="p-5 flex justify-center">
				<div aria-label="board">
					{state().map((row, ri) => (
						<div class="block overflow-hidden p-0">
							{row.map((value, ci) => (
								<div
									class={`${behaviorTable["gol"][value].color} p-0 m-0 rounded-md w-10 h-10 inline-block float-left clear-none`}
									aria-label="cell"
									onClick={() => {
										const newState = [...state()];
										newState[ri][ci] =
											(state()[ri][ci] + 1) %
											behaviorTable["gol"].length;
										setState(newState);

										// state()[ri][ci] &&
										console.log(
											`(${ri}, ${ci}): ${generateNeighborStateString(
												getNeighbors(
													ri,
													ci,
													state,
													boardConfigs().toroidal
												)
											)}`
										);
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
