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
	totalCount: number;
	errorMessages: string[];
	convertibleCount: number;
	unsupportedDetails: FormRequestValidationDetail[];
} => {
	const results = response.result?.results;
	if (!Array.isArray(results)) {
		throw new Error("검증 응답 형식이 올바르지 않아요");
	}

	const unsupportedDetails: FormRequestValidationDetail[] = [];
	const errorMessages: string[] = [];
	let totalCount = 0;
	let convertibleCount = 0;

	for (const item of results) {
		if (typeof item.message === "string" && item.message.trim().length > 0) {
			errorMessages.push(item.message.trim());
		}

		if (isFormRequestValidationSuccessResultItem(item)) {
			totalCount += item.totalCount;
			convertibleCount += item.convertible;
			if (Array.isArray(item.inconvertibleDetails)) {
				unsupportedDetails.push(...item.inconvertibleDetails);
			}
		}
	}

	return {
		totalCount,
		errorMessages,
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

			const {
				totalCount,
				errorMessages,
				convertibleCount,
				unsupportedDetails,
			} = buildValidationSummary(response);

			if (totalCount === 0) {
				return {
					type: "error",
					response,
					message:
						errorMessages.length > 0
							? errorMessages.join(" / ")
							: response.message || "검증 가능한 문항을 찾지 못했어요",
				};
			}

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
