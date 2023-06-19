import { Accessor, Setter } from "solid-js";
import {
	emptyMatrix,
	generateNeighborStateString,
	getNeighbors,
} from "./utils";
import { BoardConfigs } from "~/routes/[behavior]";
import { behaviorTable } from "./transitionTables";

export const updateState = (
	state: Accessor<number[][]>,
	setState: Setter<number[][]>,
	boardConfigs: Accessor<BoardConfigs>
) => {
	console.log(`----- UPDATE STATE -----`);

	const newState = emptyMatrix(
		boardConfigs().rowCount,
		boardConfigs().columnCount
	);
	for (let ri = 0; ri < boardConfigs().rowCount; ri++) {
		for (let ci = 0; ci < boardConfigs().columnCount; ci++) {
			const neighborStateString = generateNeighborStateString(
				getNeighbors(ri, ci, state, boardConfigs().toroidal)
			);

			const newLocalState =
				behaviorTable[boardConfigs().behavior][state()[ri][ci]]
					.transitions[neighborStateString] ??
				behaviorTable[boardConfigs().behavior][state()[ri][ci]].default;

			newState[ri][ci] = newLocalState;

			// state()[ri][ci] &&
			// console.log(
			// 	`(${ri}, ${ci}): ${generateNeighborStateString(
			// 		getNeighbors(
			// 			ri,
			// 			ci,
			// 			state,
			// 			boardConfigs().toroidal
			// 		)
			// 	)}, newLocalState: ${newLocalState}`
			// );
		}
	}

	console.log(newState);
	setState(newState);
};
