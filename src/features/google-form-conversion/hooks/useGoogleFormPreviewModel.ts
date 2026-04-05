import {
	useRequestEntryContext,
	useRequestFormContext,
} from "@features/google-form-conversion/context/RequestEntryContext";
import { buildPreviewSectionBlocksFromValidation } from "@features/google-form-conversion/lib/buildPreviewSectionBlocksFromValidation";
import { hasInconvertibleFromValidationSuccess } from "@features/google-form-conversion/lib/hasInconvertibleFromValidationSuccess";
import { pickValidationSuccessForFormLink } from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import {
	isContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { useMemo } from "react";

/**
 * 미리보기 화면용: 엔트리 검증, 검증 성공 행, 섹션 블록, 미변환 요약
 */
export const useGoogleFormPreviewModel = () => {
	const { validationResult } = useRequestEntryContext();
	const { formLink: formLinkCtx, email } = useRequestFormContext();

	const formLink = formLinkCtx.trim() ?? "";

	const isValidEntry =
		!!validationResult &&
		!!formLink &&
		isGoogleFormLinkUrl(formLink) &&
		isContactEmail(email ?? "");

	const validationSuccess = useMemo(() => {
		if (!validationResult || !formLink) return null;
		return pickValidationSuccessForFormLink(validationResult, formLink);
	}, [validationResult, formLink]);

	const previewSectionBlocks = useMemo(() => {
		if (!validationSuccess) return [];
		return buildPreviewSectionBlocksFromValidation(validationSuccess);
	}, [validationSuccess]);

	const hasInconvertible = useMemo(
		() => hasInconvertibleFromValidationSuccess(validationSuccess),
		[validationSuccess],
	);

	return {
		isValidEntry,
		validationSuccess,
		previewSectionBlocks,
		hasInconvertible,
	};
};
