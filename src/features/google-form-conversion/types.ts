import type { IapProductListItem } from "@apps-in-toss/web-framework";
import type {
	AgeCode,
	GenderCode,
	RegionCode,
} from "@features/payment/constants/payment";
import type { InterestId } from "@shared/constants/topics";
import type { FormRequestValidationResponse } from "./service/api";

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
export type RequestEntryState = {
	formLink: string;
	email: string;
};

/** 스크리닝 질문 구성 화면에서 저장해 옵션 등으로 넘기는 초안 (`answer`: 참여 허용 O=true, X=false) */
export type ScreeningDraft = {
	question: string;
	answer: boolean;
};

/** 구글폼 변환 플로우 공통 라우터 state (스크리닝 초안 선택) */
export type FlowState = RequestEntryState & {
	screening?: ScreeningDraft;
	validationResult?: FormRequestValidationResponse;
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

/** 요청 진입 화면 RHF (`RequestEntryProvider`) */
export type RequestFormValues = Pick<FormValues, "formLink" | "email"> & {
	emailSendAgreed: boolean;
};

export const DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM: RequestFormValues = {
	formLink: "",
	email: "",
	emailSendAgreed: false,
};

/**
 * 옵션(세그먼트·프로모션) 단계 입력 — `formLink`·`email`은 컨텍스트 최상위와 중복되지 않게 분리
 * (`Context.optionsDraft`)
 */
export type OptionsDraft = Omit<FormValues, "formLink" | "email">;

export const DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_DRAFT: OptionsDraft = {
	promotionCode: "",
	respondentCount: 50,
	residence: "ALL",
	interestIds: [],
	gender: "ALL",
	ages: ["ALL"],
};

/** 옵션 폼(rhf) 전체 값 — 스크리닝 초안 포함 */
export type OptionsFormValues = OptionsDraft & {
	screening: ScreeningDraft | null;
	/** 프로모션 코드 인증 성공 상태 (옵션/스크리닝 페이지 왕복 시 유지) */
	verifiedPromotionCode: string | null;
	/** 결제 가능한 IAP 상품 (옵션 페이지 결제 버튼 클릭 시점에 확정) */
	selectedProduct: IapProductListItem | null;
};

export const DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM: OptionsFormValues = {
	...DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_DRAFT,
	screening: null,
	verifiedPromotionCode: null,
	selectedProduct: null,
};
