import { For, Accessor, createResource } from "solid-js";
import { useRouteData } from "solid-start";

type Student = { name: string; house: string };

export function routeData() {
	const [students] = createResource(async () => {
		const response = await fetch("https://hogwarts.deno.dev/students");
		return (await response.json()) as Student[];
	});

	return { students };
}

export default function Page() {
	const { students } = useRouteData<typeof routeData>();

	return (
		<ul>
			<For each={students()}>{(student) => <li>{student.name}</li>}</For>
		</ul>
	);
}
