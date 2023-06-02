import { For } from "solid-js";
import { A, useLocation, FileRoutes } from "solid-start";

export const ROUTES = [
	{ path: "/", name: "Home" },
	{ path: "/about", name: "About" },
	{ path: "/board", name: "Board" },
	{ path: "/board_copy", name: "BoardCopy" },
];

export default function Nav() {
	const location = useLocation();
	const active = (path: string) =>
		path == location.pathname
			? "border-sky-600"
			: "border-transparent hover:border-sky-600";

	return (
		<nav class="bg-sky-800">
			<ul class="container flex items-center p-3 text-gray-200">
				<For each={ROUTES} fallback={<div>No Options...</div>}>
					{({ path, name }) => (
						<li class={`border-b-2 ${active(path)} mx-1.5 sm:mx-6`}>
							<A href={path}>{name}</A>
						</li>
					)}
				</For>
			</ul>
		</nav>
	);
}
