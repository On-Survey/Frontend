import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveTokens,
} from "../../utils/tokenManager";
import { reissueToken } from "../login";
import type { ApiResponse } from "./type";

/**
 * API 기본 설정
 */
const API_CONFIG = {
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 3 * 60000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // 세션 기반 인증을 위해 추가
};

// 환경별 API 서버 URL 설정
export const getApiBaseUrl = (): string => {
	return import.meta.env.VITE_API_BASE_URL || "";
};

/**
 * API 호출 헬퍼 함수
 * 응답에서 result 필드를 추출합니다.
 */
export const apiCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
	// FormData 사용 시 Content-Type을 제거하여 브라우저가 자동으로 multipart/form-data로 설정
	if (config.data instanceof FormData) {
		config.headers = {
			...config.headers,
			"Content-Type": undefined,
		};
	}

	const response = await apiClient.request<{ result: T }>(config);
	const payload = response.data?.result;

	if (payload === undefined) {
		throw new Error("API 응답에 result 값이 없습니다.");
	}

	return payload;
};

/**
 * 서버 사이드에서 사용하는 일반 Axios 클라이언트 (캐싱 미지원)
 */
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

/**
 * 요청 인터셉터
 */
apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		// 인증 관련 엔드포인트(/auth/*)에는 액세스 토큰을 붙이지 않는다.
		const isAuthEndpoint =
			typeof config.url === "string" && config.url.startsWith("/auth/");

		if (!isAuthEndpoint) {
			const token = await getAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		// 요청 로깅 (개발 환경에서만)
		if (import.meta.env.DEV) {
			console.log(
				`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
			);
		}

		return config;
	},
	(error) => {
		console.error("❌ Request Error:", error);
		return Promise.reject(error);
	},
);

interface RetryConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

/**
 * 응답 인터셉터
 */
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		// 응답 로깅 (개발 환경에서만)
		if (import.meta.env.DEV) {
			console.log(`✅ API Response: ${response.status} ${response.config.url}`);
		}

		return response;
	},
	async (error) => {
		const originalRequest = error.config as RetryConfig;

		// /auth/ 엔드포인트인지 확인 (무한 루프 방지)
		const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");

		// 2. 서버 응답이 없는 경우 (ERR_NETWORK) - 401일 수도 있으니 토큰 재발급 시도
		if (
			error.code === "ERR_NETWORK" &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthEndpoint
		) {
			originalRequest._retry = true;
			const refreshToken = await getRefreshToken();

			if (refreshToken) {
				try {
					console.log(
						"🔄 Network Error 발생 - 토큰 만료 가능성으로 재발급 시도",
					);
					const { accessToken, refreshToken: newRefreshToken } =
						await reissueToken(refreshToken);
					await saveTokens(accessToken, newRefreshToken);

					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					// 토큰 갱신 후 원래 요청 재시도
					return apiClient(originalRequest);
				} catch {
					console.error(
						"❌ 토큰 재발급 실패 - 진짜 Network Error:",
						error.message,
					);
					await clearTokens();
					return Promise.reject(error);
				}
			} else {
				console.error("❌ Network Error (토큰 없음):", error.message);
			}
		} else {
			console.error("❌ Unknown Error:", error.code || error.message);
		}

		return Promise.reject(error);
	},
);

/**
 * API 요청 헬퍼 함수들
 */
export const api = {
	/**
	 * GET 요청
	 */
	get: <T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>> => {
		return apiClient.get(url, config);
	},

	/**
	 * POST 요청
	 */
	post: <T, R>(
		url: string,
		data?: R,
		config?: AxiosRequestConfig,
	): Promise<ApiResponse<T>> => {
		return apiClient.post(url, data, config);
	},

	/**
	 * PUT 요청
	 */
	put: <T, R>(
		url: string,
		data?: R,
		config?: AxiosRequestConfig,
	): Promise<ApiResponse<T>> => {
		return apiClient.put(url, data, config);
	},

	/**
	 * PATCH 요청
	 */
	patch: <T, R>(
		url: string,
		data?: R,
		config?: AxiosRequestConfig,
	): Promise<ApiResponse<T>> => {
		return apiClient.patch(url, data, config);
	},

	/**
	 * DELETE 요청
	 */
	delete: <T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<ApiResponse<T>> => {
		return apiClient.delete(url, config);
	},
};
