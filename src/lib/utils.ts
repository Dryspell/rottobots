import { Accessor, Setter } from "solid-js";
import { BoardConfigs } from "~/routes/[behavior]";

export const getNeighbors = (
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

export const generateNeighborStateString = (neighbors: number[]) => {
	const neighborState = [] as number[];
	neighbors.forEach((neighbor) => {
		neighborState[neighbor]
			? neighborState[neighbor]++
			: (neighborState[neighbor] = 1);
	});
	const neighborStateString = neighborState.join("");
	return neighborStateString;
};

export const emptyMatrix = (rows: number, cols: number) =>
	Array.from(Array(rows).keys()).map(() =>
		Array.from(Array(cols).keys()).map(() => 0)
	);

export const fillBoard = (
	boardConfigs: Accessor<BoardConfigs>,
	state: Accessor<number[][]>,
	setState: Setter<number[][]>
) => {
	const fill = () =>
		boardConfigs().fillStyle === "random" ? Math.round(Math.random()) : 0;

	const oldRowCount = state().length;
	const oldColumnCount = state()[0].length;

	const rowStart = Math.max(
		boardConfigs().rowCount % 2 === 0
			? Math.floor((boardConfigs().rowCount - oldRowCount) / 2)
			: Math.ceil((boardConfigs().rowCount - oldRowCount) / 2),
		0
	);
	const colStart = Math.max(
		boardConfigs().columnCount % 2 === 0
			? Math.floor((boardConfigs().columnCount - oldColumnCount) / 2)
			: Math.ceil((boardConfigs().columnCount - oldColumnCount) / 2),
		0
	);

	const newState = emptyMatrix(
		boardConfigs().rowCount,
		boardConfigs().columnCount
	);
	for (let ri = 0; ri < boardConfigs().rowCount; ri++) {
		for (let ci = 0; ci < boardConfigs().columnCount; ci++) {
			newState[ri][ci] =
				ri >= rowStart &&
				ci >= colStart &&
				ri <= boardConfigs().rowCount - rowStart &&
				ci <= boardConfigs().columnCount - colStart
					? state()?.[ri - rowStart]?.[ci - rowStart] ?? fill()
					: fill();
		}
	}
	setState(newState);
};
