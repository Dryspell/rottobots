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
			color: "bg-red-500", //"#ef4444",
			default: 0,
			transitions: {
				"53": 1,
			},
		},
		{
			color: "bg-green-500", // "#22c55e", //
			default: 0,
			transitions: {
				"62": 1,
				"53": 1,
			},
		},
	],
};
