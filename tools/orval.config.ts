import { defineConfig } from "orval";

export default defineConfig({
	onsurvey: {
		output: {
			mode: "tags-split",
			target: "../src/api/onsurvey.ts",
			schemas: "../src/api/model",
			client: "react-query",
			mock: false,
			override: {
				mutator: {
					path: "../src/service/axios/orvalMutator.ts",
					name: "apiClient",
				},
				query: {
					useQuery: true,
					useSuspenseQuery: true,
					useMutation: true,
					useInfinite: true,
					signal: true,
				},
				fetch: {
					includeHttpResponseReturnType: false,
				},
			},
		},

		input: {
			target: "https://api.onsurvey.co.kr/v3/api-docs",
		},
	},
});
