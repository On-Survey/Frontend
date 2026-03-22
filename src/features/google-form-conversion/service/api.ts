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
}

export interface FormRequestValidationResultItem {
	totalCount: number;
	convertible: number;
	unconvertible: number;
	details: FormRequestValidationDetail[];
}

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
