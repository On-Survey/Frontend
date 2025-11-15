import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";

import { getAccessToken } from "../../utils/tokenManager";
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
 * 서버 사이드에서 사용하는 일반 Axios 클라이언트 (캐싱 미지원)
 */
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

/**
 * 요청 인터셉터
 */
apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		// 인증 토큰 헤더 추가
		const token = await getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
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
	(error) => {
		// 에러 처리
		if (error.response) {
			const { status, data } = error.response;

			// 인증 에러 처리
			if (status === 401) {
				handleAuthError();
			}

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
 * 인증 토큰 가져오기 (구현 필요)
 */
// function getAuthToken(): string | null {
//   // 쿠키, 로컬스토리지, 세션스토리지 등에서 토큰 가져오기
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("authToken");
//   }
//   return null;
// }

/**
 * 인증 에러 처리 (구현 필요)
 */
function handleAuthError(): void {
	// 세션 방식에서는 토큰 제거 불필요, 필요시 로그인 페이지로 리다이렉트만 사용
	// if (typeof window !== "undefined") {
	//   localStorage.removeItem("authToken");
	//   // window.location.href = '/login';
	// }
}

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
	): Promise<AxiosResponse<ApiResponse<T>>> => {
		return apiClient.get(url, config);
	},

	/**
	 * POST 요청
	 */
	post: <T>(
		url: string,
		data?: T,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<ApiResponse<T>>> => {
		return apiClient.post(url, data, config);
	},

	/**
	 * PUT 요청
	 */
	put: <T>(
		url: string,
		data?: T,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<ApiResponse<T>>> => {
		return apiClient.put(url, data, config);
	},

	/**
	 * PATCH 요청
	 */
	patch: <T>(
		url: string,
		data?: T,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<ApiResponse<T>>> => {
		return apiClient.patch(url, data, config);
	},

	/**
	 * DELETE 요청
	 */
	delete: <T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<ApiResponse<T>>> => {
		return apiClient.delete(url, config);
	},
};
