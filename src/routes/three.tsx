import { Canvas, useFrame } from "solid-three";
import { type Component, createSignal, Show } from "solid-js";
import { isServer } from "solid-js/web";
// import { OrbitControls } from "src/drei/OrbitControls";
// import * as THREE from "three";

const App: Component = () => {
	if (isServer) return null;

	function Box(props: any) {
		const [hovered, setHover] = createSignal(false);
		const [rotation, setRotation] = createSignal(0.5);
		const [active, setActive] = createSignal(false);

		useFrame((s, delta) => setRotation((r) => r + 0.01));

		return (
			<mesh
				onClick={(e) => setActive((t) => !t)}
				onPointerOver={(e) => setHover(true)}
				onPointerOut={(e) => setHover(false)}
				rotation-y={rotation()}
				scale={active() ? 1.5 : 1}
				{...props}
			>
				<boxBufferGeometry />
				<meshStandardMaterial
					color={hovered() ? "hotpink" : "orange"}
				/>
			</mesh>
		);
	}
	return (
		<Canvas
			camera={{
				position: [3, 3, 3],
			}}
			gl={{
				antialias: true,
			}}
			shadows
		>
			<ambientLight />
			{/* <ambientLight intensity={0.5} /> */}
			{/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
			{/* <pointLight position={[-10, -10, -10]} /> */}
			{/* <Box position={[-1.2, 0, 0]} /> */}
			{/* <Box position={[1.2, 0, 0]} /> */}
			{/* <OrbitControls /> */}
		</Canvas>
	);
};
export default App;
