import { useCallback, useState } from "react";
import type { ApiResponse } from "../service/axios";

interface UseApiRequestReturn<T, P> {
	isLoading: boolean;
	isSuccess: boolean;
	data: T | null;
	error: Error | null;
	execute: (...args: P extends void ? [] : [P]) => Promise<void>;
	reset: () => void;
}

/**
 * API 요청을 감싸는 커스텀 훅
 * @param apiFunction - 실행할 API 함수
 * @returns {UseApiRequestReturn} 로딩 상태, 성공 여부, 응답 데이터, 에러, 실행 함수, 리셋 함수
 *
 * @example
 * ```tsx
 * const { isLoading, isSuccess, data, error, execute } = useApiRequest<
 *   OnboardingResponse,
 *   { residence: string; interests: string[] }
 * >(OnboardingApi);
 *
 * // 사용
 * await execute({ residence: "서울", interests: ["기술"] });
 * ```
 */
export function useApiRequest<T, P = void>(
	apiFunction: (...args: P extends void ? [] : [P]) => Promise<ApiResponse<T>>,
): UseApiRequestReturn<T, P> {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const execute = useCallback(
		async (...args: P extends void ? [] : [P]) => {
			setIsLoading(true);
			setIsSuccess(false);
			setError(null);

			try {
				const response = await apiFunction(...args);
				setData(response.data);
				setIsSuccess(true);
			} catch (err) {
				const error =
					err instanceof Error
						? err
						: new Error("알 수 없는 오류가 발생했습니다.");
				setError(error);
				setIsSuccess(false);
				setData(null);
			} finally {
				setIsLoading(false);
			}
		},
		[apiFunction],
	);

	const reset = useCallback(() => {
		setIsLoading(false);
		setIsSuccess(false);
		setData(null);
		setError(null);
	}, []);

	return {
		isLoading,
		isSuccess,
		data,
		error,
		execute,
		reset,
	};
}
