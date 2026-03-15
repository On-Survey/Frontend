import type { AgeCode, GenderCode } from "@features/payment/constants/payment";

export type QuestionPackage = "light" | "standard" | "plus";

export type RespondentCount = 50 | 100 | 150 | 200 | 250 | 300;

/** 문항 구간: 1~30문항 / 31~50문항 */
export type QuestionRange = "1_30" | "31_50";

/**
 * 타게팅 케이스 (가격표 순서)
 * 1. 전체/전체(타게팅 없음) 2. 단일성별/전체연령 3. 전체성별/복수연령
 * 4. 단일성별/복수연령 5. 전체성별/단일연령 6. 단일성별/단일연령
 */
export type TargetingCase =
	| "no_targeting"
	| "single_gender_all_age"
	| "all_gender_multi_age"
	| "single_gender_multi_age"
	| "all_gender_single_age"
	| "single_gender_single_age";

export type FormValues = {
	formLink: string;
	email: string;
	/** 선택 입력. 입력 시 API로 유효 여부 검사 후 일치하면 별도 페이지로 리다이렉트 */
	promotionCode?: string;
	respondentCount: RespondentCount;
	deadline: Date;
	gender: GenderCode;
	ages: AgeCode[];
};
