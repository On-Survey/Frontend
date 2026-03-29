import type { Interest } from "@features/create-survey/service/form/types";
import type {
	AgeCode,
	GenderCode,
	RegionCode,
} from "@features/payment/constants/payment";
import { api } from "@shared/api/axios";
import { getAccessToken } from "@shared/lib/tokenManager";

export interface GoogleFormPreviewResponse {
	questionCount: number;
}

/**
 * 할인코드 검증 API 응답 (GET /v1/discount-codes/{code})
 */
export interface DiscountCodeValidateResponse {
	success: boolean;
	code: number;
	message: string;
	result: { eligible: boolean };
}

/**
 * 할인코드(프로모션 코드) 검증 — GET /v1/discount-codes/{code}
 * @param code path 파라미터 (할인코드)
 * @returns result.eligible 이 true면 유효한 코드
 */
export const validateDiscountCode = async (
	code: string,
): Promise<{ valid: boolean }> => {
	const encoded = encodeURIComponent(code);
	const { data } = await api.get<DiscountCodeValidateResponse>(
		`/v1/discount-codes/${encoded}`,
	);
	const eligible = data?.result?.eligible ?? false;
	return { valid: eligible };
};

export const getGoogleFormPreview = async (
	formLink: string,
): Promise<GoogleFormPreviewResponse> => {
	const { data } = await api.get<GoogleFormPreviewResponse>(
		`/v1/form-requests/preview?formLink=${encodeURIComponent(formLink)}`,
	);
	return data;
};

/** POST /v1/form-requests/validation 요청 바디 */
export interface FormRequestValidationBody {
	formLink: string;
	requesterEmail: string;
}

export interface FormRequestValidationDetail {
	title: string;
	type: string;
	reason: string;
	/** 폼 상 문항 순번(백엔드 제공 시). 없으면 목록 순서로 표시 */
	questionOrder?: number;
	/** 백엔드 제공 시 — 미지원 문항 미리보기에서 필수/선택 표시 */
	isRequired?: boolean;
}
export interface FormRequestValidationChoiceOption {
	optionId: number;
	questionId: number;
	content: string;
	nextSection: number;
	imageUrl: string;
}

export interface FormRequestValidationConvertibleQuestionInfo {
	questionId: number;
	surveyId: number;
	questionType: string;
	title: string | null;
	description: string | null;
	isRequired: boolean;
	questionOrder: number;
	section: number;
	imageUrl: string | null;
	/** CHOICE */
	maxChoice?: number;
	hasNoneOption?: boolean;
	hasCustomInput?: boolean;
	isSectionDecidable?: boolean;
	options?: FormRequestValidationChoiceOption[];
	date?: string;
	minValue?: string;
	maxValue?: string;
	rate?: number;
}

export interface FormRequestValidationConvertibleSection {
	sectionTitle: string;
	sectionDescription: string;
	currSection: number;
	nextSection: number;
	info: FormRequestValidationConvertibleQuestionInfo[];
}

/** 검증 성공한 폼 URL별 결과 (에러 행과 구분: `convertible` 등 포함) */
export interface FormRequestValidationSuccessResultItem {
	url: string;
	/** 성공 시 null·생략 가능 (백엔드에 따라 undefined일 수 있음) */
	message?: null;
	totalCount: number;
	convertible: number;
	inconvertible: number;
	inconvertibleDetails: FormRequestValidationDetail[];
	convertibleDetails: FormRequestValidationConvertibleSection[];
}

/** 검증 실패한 URL (`message`에 사유) */
export interface FormRequestValidationErrorResultItem {
	url: string;
	message: string;
}

export type FormRequestValidationResultItem =
	| FormRequestValidationSuccessResultItem
	| FormRequestValidationErrorResultItem;

export const isFormRequestValidationSuccessResultItem = (
	item: FormRequestValidationResultItem,
): item is FormRequestValidationSuccessResultItem => {
	if (typeof item !== "object" || item === null) return false;
	if (!("convertible" in item)) return false;
	const convertible = (item as FormRequestValidationSuccessResultItem)
		.convertible;
	return typeof convertible === "number";
};

/** POST /v1/form-requests/validation 응답 바디 */
export interface FormRequestValidationResponse {
	code: number;
	message: string;
	result: {
		results: FormRequestValidationResultItem[];
	};
	success: boolean;
}

/**
 * 구글폼 변환 신청 전 폼·이메일 검증 — POST /v1/form-requests/validation
 */
export const validateFormRequest = async (
	body: FormRequestValidationBody,
): Promise<FormRequestValidationResponse> => {
	const { data } = await api.post<
		FormRequestValidationResponse,
		FormRequestValidationBody
	>(`/v1/form-requests/validation`, body);
	return data;
};

/** POST /v1/form-requests 의 `screening` */
export interface FormRequestScreeningBody {
	content: string;
	answer: boolean;
}

/** POST /v1/form-requests 의 `surveyForm` (항목별 *Price 없음, 결제 금액은 totalCoin·dueCountPrice) */
export interface GoogleFormSurveyFormRequest {
	deadline: string;
	gender: GenderCode;
	ages: AgeCode[];
	residence: RegionCode;
	dueCount: number;
	dueCountPrice: number;
	totalCoin: number;
	discountCode?: string;
}

/**
 * 구글폼 변환 신청 API (POST /v1/form-requests) 요청 바디
 */
export interface CreateGoogleFormConversionRequestBody {
	formLink: string;
	requesterEmail: string;
	screening?: FormRequestScreeningBody;
	surveyForm: GoogleFormSurveyFormRequest;
	/** 관심사 코드 (CAREER, BUSINESS 등) */
	interests?: Interest[];
}

export interface CreateGoogleFormConversionRequestResponse {
	success: boolean;
	data?: {
		requestId?: string;
	};
	message?: string;
}

export const createGoogleFormConversionRequest = async (
	body: CreateGoogleFormConversionRequestBody,
): Promise<CreateGoogleFormConversionRequestResponse> => {
	const token = await getAccessToken();
	const { data } = await api.post<
		CreateGoogleFormConversionRequestResponse,
		CreateGoogleFormConversionRequestBody
	>(`/v1/form-requests`, body, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	return data;
};
