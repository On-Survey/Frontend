import {
	type FormRequestValidationResponse,
	type FormRequestValidationSuccessResultItem,
	isFormRequestValidationSuccessResultItem,
} from "../service/api";

/** 구글폼 URL에서 문서 ID 추출 (`/d/TOKEN`, `/d/e/TOKEN`) */
export const extractGoogleFormDocumentId = (url: string): string | null => {
	const m = url.trim().match(/\/forms\/d\/(?:e\/)?([-\w]+)/);
	return m?.[1] ?? null;
};

/**
 * 사용자가 입력한 링크와 동일한 폼의 검증 성공 행을 고른다.
 * ID 매칭이 안 되면 첫 성공 행을 사용한다.
 */
export const pickValidationSuccessForFormLink = (
	validationResult: FormRequestValidationResponse,
	formLink: string,
): FormRequestValidationSuccessResultItem | null => {
	const successItems = validationResult.result.results.filter(
		isFormRequestValidationSuccessResultItem,
	);
	if (successItems.length === 0) return null;

	const targetId = extractGoogleFormDocumentId(formLink);
	if (targetId) {
		const matched = successItems.find(
			(item) => extractGoogleFormDocumentId(item.url) === targetId,
		);
		if (matched) return matched;
	}

	return successItems[0] ?? null;
};
