import { Show, Switch } from "solid-js";
import { useSearchParams } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { db } from "~/db";

export function routeData() {
	const [searchParams] = useSearchParams();
	return createServerData$(
		async (query) => {
			return db.user.findMany({ where: { ...query } });
		},
		{
			key: () => searchParams,
		}
	);
}

export default function SearchBox() {
	const [searchParams, setSearchParams] = useSearchParams();

	// const data = createServerData$(
	// 	async (query) => {
	// 		return db.user.findMany({ where: { ...query } });
	// 	},
	// 	{
	// 		key: () => searchParams,
	// 	}
	// );

	const testUser = {
		username: "test",
		email: "test",
		name: "test",
		password: "test",
	};

	const data = createServerData$(async (query) => {
		return db.user.upsert({
			where: { username: testUser.username },
			create: { ...testUser },
			update: { ...testUser },
		});
	});

	return (
		<div>
			<input
				type="text"
				onInput={(e) =>
					setSearchParams({ query: e.currentTarget.value })
				}
			/>
			<Show when={data}>
				<div>{JSON.stringify(data)}</div>
			</Show>
		</div>
	);
}
