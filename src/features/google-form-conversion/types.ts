import type {
	AgeCode,
	GenderCode,
	RegionCode,
} from "@features/payment/constants/payment";
import type { InterestId } from "@shared/constants/topics";

export type QuestionPackage = "light" | "standard" | "plus";

export type RespondentCount = 50 | 100 | 150 | 200 | 250 | 300;

export const RESPONDENT_OPTIONS: {
	label: string;
	value: RespondentCount;
	display: string;
}[] = [
	{ label: "50명", value: 50, display: "50명" },
	{ label: "100명", value: 100, display: "100명" },
	{ label: "150명", value: 150, display: "150명" },
	{ label: "200명", value: 200, display: "200명" },
	{ label: "250명", value: 250, display: "250명" },
	{ label: "300명", value: 300, display: "300명" },
];

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

/** 신청(폼 링크·이메일) 단계에서 이후 화면으로 넘길 때 사용하는 라우터 state */
export type GoogleFormConversionRequestEntryState = {
	formLink: string;
	email: string;
};

/** 스크리닝 질문 구성 화면에서 저장해 옵션 등으로 넘기는 초안 (`answer`: 참여 허용 O=true, X=false) */
export type GoogleFormConversionScreeningDraft = {
	question: string;
	answer: boolean;
};

/** 구글폼 변환 플로우 공통 라우터 state (스크리닝 초안 선택) */
export type GoogleFormConversionFlowState =
	GoogleFormConversionRequestEntryState & {
		screening?: GoogleFormConversionScreeningDraft;
	};

export type FormValues = {
	formLink: string;
	email: string;
	/** 선택 입력. 입력 시 API로 유효 여부 검사 후 일치하면 별도 페이지로 리다이렉트 */
	promotionCode?: string;
	respondentCount: RespondentCount;
	/** 타깃 거주지 (결제/신청 API `residence`) */
	residence: RegionCode;
	/** 관심사 (다중 선택, Interest API 코드로 변환해 전달) */
	interestIds: InterestId[];
	gender: GenderCode;
	ages: AgeCode[];
};
