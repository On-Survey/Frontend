/**
 * Axios 모듈 메인 export 파일
 */

// API 클라이언트
// 기본 export
export {
	api,
	apiClient,
	apiClient as default,
	getApiBaseUrl,
} from "./apiClient";

// 타입 정의
export type * from "./type";
