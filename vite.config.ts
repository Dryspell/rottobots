import netlify from "solid-start-netlify";
import solid from "solid-start/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import { DOMElements, SVGElements } from "solid-js/web/dist/dev.cjs";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	// "server.hmr.overlay":false,
	// ssr: false,
	plugins: [
		solid({
			adapter: netlify({ edge: true }),
		}),
		solidPlugin({
			solid: {
				moduleName: "solid-js/web",
				// @ts-ignore
				generate: "dynamic",
				renderers: [
					{
						name: "dom",
						moduleName: "solid-js/web",
						elements: [
							...DOMElements.values(),
							...SVGElements.values(),
						],
					},
					{
						name: "universal",
						moduleName: "solid-three",
						elements: [],
					},
				],
			},
		}),
		inspect(),
	],
});
