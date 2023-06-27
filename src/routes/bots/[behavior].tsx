import { createSignal } from "solid-js";
import { behaviorTable } from "../../lib/transitionTables";
import { fillBoard } from "~/lib/utils";
import {
	BoardSizeSlider,
	ClearButton,
	RandomizeButton,
	TimeStateButtonGroup,
} from "~/components/Controls";
import { useParams, useSearchParams } from "solid-start";
import { Board } from "~/components/Board";
import { FillStyleCheckbox } from "../../components/Controls";
import { createTimer } from "@solid-primitives/timer";
import { updateState } from "~/lib/updateState";

export type BoardConfigs = ReturnType<typeof defaultBoardConfigs>;
export const defaultBoardConfigs = () => ({
	columnCount: 20,
	rowCount: 20,
	toroidal: false,
	fillStyle: "dead",
	behavior: "gol",
	cellShape: null,
	continuous: false,
});

export type MetaState = ReturnType<typeof defaultMetaState>;
export const defaultMetaState = () => ({
	turnNumber: 0,
	isPlaying: false,
	runTime: 0,
	turnDelay: 1000,
});

export default function BoardPage() {
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
				boardConfigs().continuous
					? Math.random()
					: Math.round(Math.random())
			)
		)
	);

	const [metaState, setMetaState] = createSignal(defaultMetaState());

	createTimer(
		() => {
			setMetaState(() => ({
				...metaState(),
				turnNumber: metaState().turnNumber + 1,
			}));
			console.log(`-- Turn: ${metaState().turnNumber} --`);
			updateState(state, setState, boardConfigs);
		},
		() => metaState().isPlaying && metaState().turnDelay,
		setInterval
	);

	return (
		<div class="">
			<div class="p-5 flex align-middle items-center justify-evenly">
				<ClearButton setState={setState} boardConfigs={boardConfigs} />
				<RandomizeButton
					setState={setState}
					boardConfigs={boardConfigs}
				/>
				<TimeStateButtonGroup
					state={state}
					setState={setState}
					boardConfigs={boardConfigs}
					metaState={metaState}
					setMetaState={setMetaState}
				/>
				<FillStyleCheckbox
					boardConfigs={boardConfigs}
					setBoardConfigs={setBoardConfigs}
				/>
			</div>

			<div class="p-5 flex justify-center">
				<BoardSizeSlider
					boardConfigs={boardConfigs}
					setBoardConfigs={setBoardConfigs}
					state={state}
					setState={setState}
				/>
			</div>

			<div class="p-5 flex justify-center">
				<Board
					state={state}
					boardConfigs={boardConfigs}
					cParams={cParams}
					setState={setState}
				/>
			</div>
		</div>
	);
}
