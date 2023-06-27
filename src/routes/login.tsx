import { createRouteAction, redirect } from "solid-start";

export default function MyComponent() {
	const [_, { Form }] = createRouteAction(async (formData: FormData) => {
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		const username = formData.get("username");
		if (username === "admin") {
			return redirect("/admin");
		} else {
			throw new Error("Invalid username");
		}
		return redirect("/home");
	});

	return (
		<Form>
			<label for="username">Username:</label>
			<input type="text" name="username" />
			<input type="submit" value="submit" />
		</Form>
	);
}
