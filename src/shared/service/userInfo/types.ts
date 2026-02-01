/**
 * 회원 정보 조회 응답 타입
 */
export interface MemberInfo {
	name: string;
	profileUrl: string;
	coin: number;
	promotionPoint: number;
	isOnboardingCompleted: boolean;
	residence?: string;
	age?: string;
	gender?: string;
}
