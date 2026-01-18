/**
 * 네비게이션 관련 타입 정의
 */

/**
 * 리다이렉트 후 돌아올 페이지 정보
 */
export interface ReturnTo {
	path: string;
	state?: Record<string, unknown>;
}

/**
 * location.state에 returnTo 정보를 포함하는 타입
 */
export interface LocationStateWithReturnTo {
	returnTo?: ReturnTo;
}
