import {
	type FormRequestValidationBody,
	type FormRequestValidationDetail,
	type FormRequestValidationResponse,
	isFormRequestValidationSuccessResultItem,
	validateFormRequest,
} from "@features/google-form-conversion/service/api";
import { useMutation } from "@tanstack/react-query";

export type ValidateRequestSuccessResult = {
	type: "success";
	response: FormRequestValidationResponse;
	convertibleCount: number;
	unsupportedDetails: FormRequestValidationDetail[];
};

export type ValidateRequestPartialSuccessResult = {
	type: "partial_success";
	response: FormRequestValidationResponse;
	convertibleCount: number;
	unsupportedDetails: FormRequestValidationDetail[];
};

export type ValidateRequestErrorResult = {
	type: "error";
	response: FormRequestValidationResponse;
	message: string;
};

export type ValidateRequestResult =
	| ValidateRequestSuccessResult
	| ValidateRequestPartialSuccessResult
	| ValidateRequestErrorResult;

const buildValidationSummary = (
	response: FormRequestValidationResponse,
): {
	convertibleCount: number;
	unsupportedDetails: FormRequestValidationDetail[];
} => {
	const results = response.result?.results;
	if (!Array.isArray(results)) {
		throw new Error("검증 응답 형식이 올바르지 않아요");
	}

	const unsupportedDetails: FormRequestValidationDetail[] = [];
	let convertibleCount = 0;

	for (const item of results) {
		if (!isFormRequestValidationSuccessResultItem(item)) continue;
		convertibleCount += item.convertible;
		if (Array.isArray(item.inconvertibleDetails)) {
			unsupportedDetails.push(...item.inconvertibleDetails);
		}
	}

	return {
		convertibleCount,
		unsupportedDetails,
	};
};

export const useGoogleFormRequestValidation = () => {
	return useMutation({
		mutationFn: async (
			body: FormRequestValidationBody,
		): Promise<ValidateRequestResult> => {
			const response = await validateFormRequest(body);

			if (!response.success) {
				return {
					type: "error",
					response,
					message: response.message || "검증에 실패했어요",
				};
			}

			const { convertibleCount, unsupportedDetails } =
				buildValidationSummary(response);

			const hasUnsupportedQuestions = unsupportedDetails.length > 0;

			if (hasUnsupportedQuestions) {
				return {
					type: "partial_success",
					response,
					convertibleCount,
					unsupportedDetails,
				};
			}

			return {
				type: "success",
				response,
				convertibleCount,
				unsupportedDetails: [],
			};
		},
		retry: 0,
	});
};
