import {
	extractGoogleFormDocumentId,
	pickValidationSuccessForFormLink,
} from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import {
	type FormRequestValidationBody,
	type FormRequestValidationDetail,
	type FormRequestValidationResponse,
	validateFormRequest,
} from "@features/google-form-conversion/service/api";
import { getTotalQuestionCountForPricing } from "@features/google-form-conversion/utils";
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
	formLink: string,
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

	const trimmedLink = formLink.trim();
	const success = pickValidationSuccessForFormLink(response, trimmedLink);

	if (!success) {
		const targetId = extractGoogleFormDocumentId(trimmedLink);
		const messages: string[] = [];
		for (const item of results) {
			if (typeof item.message !== "string" || !item.message.trim()) continue;
			if (targetId && extractGoogleFormDocumentId(item.url) !== targetId) {
				continue;
			}
			messages.push(item.message.trim());
		}
		return {
			totalCount: 0,
			errorMessages:
				messages.length > 0
					? messages
					: response.message?.trim()
						? [response.message.trim()]
						: [],
			convertibleCount: 0,
			unsupportedDetails: [],
		};
	}

	const totalCount = getTotalQuestionCountForPricing(success);
	const rowDetailMessage =
		typeof success.message === "string" && success.message.trim().length > 0
			? success.message.trim()
			: null;

	// success 본문인데 문항 0건이면 행의 message(예: 권한 없음)를 에러 문구로 쓴다
	if (totalCount === 0) {
		return {
			totalCount: 0,
			errorMessages: rowDetailMessage ? [rowDetailMessage] : [],
			convertibleCount: 0,
			unsupportedDetails: [],
		};
	}

	return {
		totalCount,
		errorMessages: [],
		convertibleCount: success.convertible,
		unsupportedDetails: [...(success.inconvertibleDetails ?? [])],
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
			} = buildValidationSummary(response, body.formLink);

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
