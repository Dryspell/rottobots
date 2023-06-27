// import { startFromFile } from "~/lib/visualizerFromFile";

export default function Home() {
	const startFromFile = async (context: AudioContext) => {
		const res = await fetch(`http://localhost:3000/HipHopPolice.mp3`);

		const byteArray = await res.arrayBuffer();

		// const context = new AudioContext();
		const audioBuffer = await context.decodeAudioData(byteArray);
		const source = context.createBufferSource();
		source.buffer = audioBuffer;

		source.connect(context.destination);
		source.start();
	};

	if (typeof window === "undefined") return;

	// window.AudioContext = window.AudioContext || window.webkitAudioContext;
	startFromFile(new AudioContext());
	return (
		<main class="text-center mx-auto text-gray-700 p-4">
			<h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
				Hello world!
			</h1>
		</main>
	);
}
