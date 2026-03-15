import { api } from "@shared/api/axios";
import { getAccessToken } from "@shared/lib/tokenManager";

export interface GoogleFormPreviewResponse {
	questionCount: number;
}

/**
 * 구글폼 링크로 문항 수 조회 (서버에서 폼 분석)
 */
export interface ValidatePromotionCodeResponse {
	valid: boolean;
}

/**
 * 프로모션 코드 유효 여부 확인 (일치 시 true).
 * TODO: 실제 API 연동 후 엔드포인트 연결
 */
export const validatePromotionCode = async (
	_code: string,
): Promise<ValidatePromotionCodeResponse> => {
	// API 및 페이지 준비 후 연동
	// const { data } = await api.post('/v1/promotion/validate', { code });
	// return data;
	return Promise.resolve({ valid: false });
};

export const getGoogleFormPreview = async (
	formLink: string,
): Promise<GoogleFormPreviewResponse> => {
	const { data } = await api.get<GoogleFormPreviewResponse>(
		`/v1/form-requests/preview?formLink=${encodeURIComponent(formLink)}`,
	);
	return data;
};

export interface CreateGoogleFormConversionRequestParams {
	formLink: string;
	questionCount: number;
	targetResponseCount: number;
	deadline: string;
	requesterEmail: string;
	price: number;
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
