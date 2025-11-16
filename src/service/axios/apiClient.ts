import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "../../utils/tokenManager";
import type { ApiResponse } from "./type";

export const apiCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
	const response = await apiClient.request<{ result: T }>(config);

	// 백엔드 응답 형식: { code: number, message: string, result: T, success: boolean }
	if (!response.data) {
		throw new Error("API 응답에 데이터가 없습니다.");
	}
	const payload = response.data.result;

	// result가 null이거나 undefined인 경우 void 응답으로 처리
	if (payload === null || payload === undefined) {
		return undefined as T;
	}
	return payload;
};

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
		// 에러 처리
		if (error.response) {
			const { status, data } = error.response;

			// // 인증 에러 처리
			// if (status === 401) {
			// 	const refreshToken = await getRefreshToken();

			// 	if (!refreshToken) {
			// 		throw new Error("리프레시 토큰이 없습니다.");
			// 	}

			// 	const newRefreshToken = await reissueToken(refreshToken);
			// 	if (newRefreshToken) {
			// 		apiClient.defaults.headers.common["x-refresh-token"] =
			// 			`Bearer ${newRefreshToken}`;
			// 	}
			// }

			// 에러 로깅
			console.error(`❌ API Error: ${status}`, data);
		} else if (error.request) {
			console.error("❌ Network Error:", error.request);
		} else {
			console.error("❌ Request Setup Error:", error.message);
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
