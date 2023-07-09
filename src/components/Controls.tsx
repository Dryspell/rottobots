import { ButtonGroup, IconButton } from "@suid/material";
import { BiRegularSkipNext } from "solid-icons/bi";
import { FiPause, FiPlay } from "solid-icons/fi";
import { TbPlayerTrackNext as FastForwardIcon } from "solid-icons/tb";
import { Accessor, Setter } from "solid-js";
import { updateState } from "~/lib/updateState";
import { emptyMatrix, fillBoard } from "~/lib/utils";
import {
	BoardConfigs,
	MetaState,
	defaultBoardConfigs,
} from "~/routes/bots/[behavior]";

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
					() =>
						Array.from(
							Array(props.boardConfigs().columnCount).keys()
						).map(() => Math.round(Math.random()))
				)
			)
		}
	>
		Randomize
	</button>
);

export const TimeStateButtonGroup = (props: {
	state: Accessor<number[][]>;
	setState: Setter<number[][]>;
	boardConfigs: Accessor<BoardConfigs>;
	metaState: Accessor<MetaState>;
	setMetaState: Setter<MetaState>;
}) => {
	return (
		<>
			<ButtonGroup
				variant="contained"
				color="primary"
				aria-label="contained primary button group"
			>
				{!props.metaState().isPlaying ? (
					<IconButton>
						<FiPlay
							// eslint-disable-next-line solid/reactivity
							onClick={() => {
								props.setMetaState((prev) => ({
									...prev,
									isPlaying: !prev.isPlaying,
								}));
							}}
						/>
					</IconButton>
				) : (
					<IconButton
						onClick={() =>
							props.setMetaState((prev) => ({
								...prev,
								isPlaying: !prev.isPlaying,
							}))
						}
					>
						<FiPause />
					</IconButton>
				)}
				<IconButton
					onClick={() =>
						updateState(
							props.state,
							props.setState,
							props.boardConfigs
						)
					}
				>
					<BiRegularSkipNext />
				</IconButton>
				<IconButton
					onClick={() => {
						props.setMetaState(() => ({
							...props.metaState(),
							turnDelay: props.metaState().turnDelay - 100,
						}));
						console.log(props.metaState().turnDelay);
					}}
				>
					<FastForwardIcon />
				</IconButton>
				{/* <button
					aria-label="update state"
					class="rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
					onClick={() =>
						updateState(
							props.state,
							props.setState,
							props.boardConfigs
						)
					}
				>
					Update State
				</button> */}
			</ButtonGroup>
		</>
	);
};

export const FillStyleCheckbox = (props: {
	boardConfigs: Accessor<ReturnType<typeof defaultBoardConfigs>>;
	setBoardConfigs: Setter<ReturnType<typeof defaultBoardConfigs>>;
}) => {
	return (
		<div class="flex items-center align-middle">
			<input
				type="checkbox"
				class="toggle toggle-lg toggle-primary"
				checked={props.boardConfigs().fillStyle === "random"}
				onChange={(e) => {
					props.setBoardConfigs({
						...props.boardConfigs(),
						fillStyle: e.target.checked ? "random" : "dead",
					});
					console.log(props.boardConfigs());
				}}
			/>
			<span class="text-2xl px-2">
				Fill Style: {props.boardConfigs().fillStyle}
			</span>
		</div>
	);
};

export const BoardSizeSlider = (props: {
	boardConfigs: Accessor<ReturnType<typeof defaultBoardConfigs>>;
	setBoardConfigs: Setter<ReturnType<typeof defaultBoardConfigs>>;
	state: Accessor<number[][]>;
	setState: Setter<number[][]>;
}) => (
	<>
		<input
			type="range"
			min="0"
			max="40"
			value={props.boardConfigs().rowCount}
			class="range-primary h-10 w-96 px-2"
			onInput={(e) => {
				props.setBoardConfigs({
					...props.boardConfigs(),
					columnCount: parseInt(e.target.value),
					rowCount: parseInt(e.target.value),
				});
				fillBoard(props.boardConfigs, props.state, props.setState);
			}}
		/>
		<span class="text-2xl px-2">
			Board Size: {props.boardConfigs().rowCount}
		</span>
	</>
);
