/**
 * API 응답 공통 타입
 */
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	code?: string;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

/**
 * 에러 응답 타입
 */
export interface ApiError {
	success: false;
	message: string;
	code?: string;
	errors?: Record<string, string[]>;
}

/**
 * 요청 상태 타입
 */
export type RequestStatus = "idle" | "loading" | "success" | "error";

/**
 * API 요청 옵션 타입 (Next.js 캐싱 포함)
 */
export interface ApiRequestOptions {
	revalidate?: number | false;
	tags?: string[];
	cache?: RequestCache;
}

/**
 * 예시 사용자 타입
 */
export interface User {
	id: number;
	email: string;
	name: string;
	avatar?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * 예시 로그인 요청 타입
 */
export interface LoginRequest {
	email: string;
	password: string;
}

/**
 * 예시 로그인 응답 타입
 */
export interface LoginResponse {
	user: User;
	token: string;
	refreshToken: string;
}
