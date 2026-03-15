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

/** @deprecated validateDiscountCode 사용 권장. 호환용 별칭 */
export const validatePromotionCode = validateDiscountCode;

export const getGoogleFormPreview = async (
	formLink: string,
): Promise<GoogleFormPreviewResponse> => {
	const { data } = await api.get<GoogleFormPreviewResponse>(
		`/v1/form-requests/preview?formLink=${encodeURIComponent(formLink)}`,
	);
	return data;
};

/**
 * 구글폼 변환 신청 API (POST /v1/form-requests) 요청 바디
 * 설문 폼 완성 API와 동일한 바디 필드 지원 (deadline, gender, ages, residence, 할인코드 등)
 */
export interface CreateGoogleFormConversionRequestParams {
	formLink: string;
	questionCount: number;
	targetResponseCount: number;
	deadline: string;
	requesterEmail: string;
	price: number;
	/** 성별 (ALL | MALE | FEMALE) */
	gender?: string;
	/** 성별 가격 */
	genderPrice?: number;
	/** 연령대 목록 (TEN, TWENTY, THIRTY 등) */
	ages?: string[];
	/** 연령대 가격 */
	agePrice?: number;
	/** 거주지 (SEOUL, GYEONGGI 등) */
	residence?: string;
	/** 거주지 가격 */
	residencePrice?: number;
	/** 희망 응답자 수 */
	dueCount?: number;
	/** 응답자 수 가격 */
	dueCountPrice?: number;
	/** 총 코인 */
	totalCoin?: number;
	/** 할인(프로모션) 코드 */
	discountCode?: string;
}

export interface CreateGoogleFormConversionRequestResponse {
	success: boolean;
	data?: {
		requestId?: string;
	};
	message?: string;
}

export const createGoogleFormConversionRequest = async (
	params: CreateGoogleFormConversionRequestParams,
): Promise<CreateGoogleFormConversionRequestResponse> => {
	const token = await getAccessToken();
	const { data } = await api.post<
		CreateGoogleFormConversionRequestResponse,
		CreateGoogleFormConversionRequestParams
	>(`/v1/form-requests`, params, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	return data;
};
