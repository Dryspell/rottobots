type State = {
	color: string;
	default: number;
	transitions: {
		[key: string]: number;
	};
};

export type TransitionTable = State[];

export const behaviorTable: Record<string, TransitionTable> = {
	gol: [
		{
			color: "white",
			default: 0,
			transitions: {
				"53": 1,
			},
		},
		{
			color: "black",
			default: 0,
			transitions: {
				"62": 1,
				"53": 1,
			},
		},
	],
};
