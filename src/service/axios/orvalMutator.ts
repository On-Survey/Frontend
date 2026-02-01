import type { AxiosRequestConfig } from "axios";
import { apiClient as axiosInstance } from "./apiClient";

/** RequestInit를 AxiosRequestConfig로 변환 */
function toAxiosConfig(init?: RequestInit): AxiosRequestConfig {
	if (!init) return {};
	return {
		method: init.method as AxiosRequestConfig["method"],
		headers: init.headers as AxiosRequestConfig["headers"],
		data: init.body,
		signal: init.signal ?? undefined,
	};
}

/**
 * Orval mutator: 기존 axios 인스턴스를 사용하는 요청 함수.
 * orval 생성 코드는 apiClient(url, init) 형태로 호출합니다.
 */
export const apiClient = <T>(
	urlOrConfig: string | AxiosRequestConfig,
	maybeInit?: RequestInit,
): Promise<T> => {
	const config: AxiosRequestConfig =
		typeof urlOrConfig === "string"
			? { url: urlOrConfig, ...toAxiosConfig(maybeInit) }
			: urlOrConfig;
	return axiosInstance.request(config).then((res) => res.data as T);
};
