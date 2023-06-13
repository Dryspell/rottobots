import { behaviorTable } from "~/lib/transitionTables";
import {
	emptyMatrix,
	generateNeighborStateString,
	getNeighbors,
} from "~/lib/utils";
import { Accessor, Setter } from "solid-js";
import { BoardConfigs } from "~/routes/[behavior]";

export const ClearButton = (props: {
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

export const RandomizeButton = (props: {
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

export const UpdateButton = (props: {
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
						behaviorTable[props.boardConfigs().behavior][
							props.state()[ri][ci]
						].transitions[neighborStateString] ??
						behaviorTable[props.boardConfigs().behavior][
							props.state()[ri][ci]
						].default;

					newState[ri][ci] = newLocalState;

					// state()[ri][ci] &&
					// console.log(
					// 	`(${ri}, ${ci}): ${generateNeighborStateString(
					// 		getNeighbors(
					// 			ri,
					// 			ci,
					// 			props.state,
					// 			props.boardConfigs().toroidal
					// 		)
					// 	)}, newLocalState: ${newLocalState}`
					// );
				}
			}

			console.log(newState);
			props.setState(newState);
		}}
	>
		Update State
	</button>
);
