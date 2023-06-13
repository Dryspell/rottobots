import { createSignal } from "solid-js";
import { behaviorTable } from "../lib/transitionTables";
import {
	fillBoard,
	generateNeighborStateString,
	getNeighbors,
} from "~/lib/utils";
import {
	ClearButton,
	RandomizeButton,
	UpdateButton,
} from "~/components/Controls";
import { useParams, useSearchParams } from "solid-start";

export type BoardConfigs = ReturnType<typeof defaultBoardConfigs>;

export const defaultBoardConfigs = () => ({
	columnCount: 20,
	rowCount: 20,
	toroidal: false,
	fillStyle: "dead",
	behavior: "gol",
	cellShape: null,
});

export default function Board() {
	const [searchParams] = useSearchParams();
	const params = useParams<{ behavior: string }>();
	const cParams = Object.fromEntries(
		Object.entries({ ...searchParams, ...params }).map(([k, v]) =>
			k === "behavior"
				? behaviorTable?.[v]
					? ["behavior", v]
					: ["behavior", "gol"]
				: parseInt(v)
				? [k, parseInt(v) ? parseInt(v) : v]
				: [k, v]
		)
	) as Record<string, string | number>;
	console.log(cParams);

	const [boardConfigs, setBoardConfigs] = createSignal({
		...defaultBoardConfigs(),
		...cParams,
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
			<div class="p-5 flex align-middle items-center justify-evenly">
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
				<div class="flex items-center align-middle">
					<input
						type="checkbox"
						class="toggle toggle-lg toggle-primary"
						checked={boardConfigs().fillStyle === "random"}
						onChange={(e) => {
							setBoardConfigs({
								...boardConfigs(),
								fillStyle: e.target.checked ? "random" : "dead",
							});
							console.log(boardConfigs());
						}}
					/>
					<span class="text-2xl px-2">
						Fill Style: {boardConfigs().fillStyle}
					</span>
				</div>
			</div>

			<div class="p-5 flex justify-center">
				<input
					type="range"
					min="0"
					max="40"
					value={boardConfigs().rowCount}
					class="range-primary h-10 w-96 px-2"
					onInput={(e) => {
						setBoardConfigs({
							...boardConfigs(),
							columnCount: parseInt(e.target.value),
							rowCount: parseInt(e.target.value),
						});
						fillBoard(boardConfigs, state, setState);
					}}
				/>
				<span class="text-2xl px-2">
					Board Size: {boardConfigs().rowCount}
				</span>
			</div>

			<div class="p-5 flex justify-center">
				<div aria-label="board">
					{state().map((row, ri) => (
						<div class="block overflow-hidden p-0">
							{row.map((value, ci) => (
								<div
									class={`${
										behaviorTable[boardConfigs().behavior][
											value
										].color
									} p-0 m-0 rounded-md w-10 h-10 inline-block float-left clear-none`}
									aria-label="cell"
									onClick={() => {
										const newState = [...state()];
										newState[ri][ci] =
											(state()[ri][ci] + 1) %
											behaviorTable[cParams.behavior]
												.length;
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
