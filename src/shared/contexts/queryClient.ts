import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 기본 쿼리 옵션
			retry: 3,
			refetchOnWindowFocus: false,
			staleTime: 2 * 60 * 1000,
			gcTime: 5 * 60 * 1000,
		},
		mutations: {
			// 기본 mutation 옵션
			retry: 3,
		},
	},
});
