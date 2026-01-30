import { getAccessToken } from "../../utils/tokenManager";
import { api } from "../axios";

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
