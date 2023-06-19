import { Accessor, Setter } from "solid-js";
import { behaviorTable } from "~/lib/transitionTables";
import { generateNeighborStateString, getNeighbors } from "~/lib/utils";

export function Board(props: {
	state: Accessor<number[][]>;
	boardConfigs: Accessor<{
		columnCount: number;
		rowCount: number;
		toroidal: boolean;
		fillStyle: string;
		behavior: string;
		cellShape: null;
	}>;
	cParams: Record<string, string | number>;
	setState: Setter<number[][]>;
}) {
	return (
		<div aria-label="board">
			{props.state().map((row, ri) => (
				<div class="block overflow-hidden p-0">
					{row.map((value, ci) => (
						<div
							class={`${
								behaviorTable[props.boardConfigs().behavior][
									value
								].color
							} p-0 m-0 rounded-md w-10 h-10 inline-block float-left clear-none`}
							aria-label="cell"
							onClick={() => {
								const newState = [...props.state()];
								newState[ri][ci] =
									(props.state()[ri][ci] + 1) %
									behaviorTable[props.cParams.behavior]
										.length;
								props.setState(newState);

								// state()[ri][ci] &&
								console.log(
									`(${ri}, ${ci}): ${generateNeighborStateString(
										getNeighbors(
											ri,
											ci,
											props.state,
											props.boardConfigs().toroidal
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
	);
}
