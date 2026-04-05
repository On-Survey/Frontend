import {
	useRequestEntryContext,
	useRequestFormContext,
} from "@features/google-form-conversion/context/RequestEntryContext";
import { buildPreviewSectionBlocksFromValidation } from "@features/google-form-conversion/lib/buildPreviewSectionBlocksFromValidation";
import { getQuestionNumberLabelForValidationDetail } from "@features/google-form-conversion/lib/getQuestionNumberLabelForValidationDetail";
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

	const inconvertibleDetails = useMemo(() => {
		const raw = validationSuccess?.inconvertibleDetails ?? [];
		return [...raw]
			.map((item, originalIndex) => ({ item, originalIndex }))
			.sort((a, b) => {
				const ao =
					a.item.order ?? a.item.questionOrder ?? Number.POSITIVE_INFINITY;
				const bo =
					b.item.order ?? b.item.questionOrder ?? Number.POSITIVE_INFINITY;
				if (ao !== bo) return ao - bo;
				return a.originalIndex - b.originalIndex;
			})
			.map(({ item }) => item);
	}, [validationSuccess]);

	const inconvertibleTotalCount = useMemo(() => {
		const detailsLen = inconvertibleDetails.length;
		const fromApi = validationSuccess?.inconvertible ?? 0;
		return Math.max(detailsLen, fromApi);
	}, [inconvertibleDetails.length, validationSuccess]);

	const hasInconvertible = useMemo(
		() => hasInconvertibleFromValidationSuccess(validationSuccess),
		[validationSuccess],
	);

	const firstInconvertibleHighlightLine = useMemo(() => {
		const d = inconvertibleDetails[0];
		if (!d) return null;
		const label = getQuestionNumberLabelForValidationDetail(d, 0);
		const title = d.title?.trim() ? d.title : "(제목 없음)";
		return `${label} ${title}`;
	}, [inconvertibleDetails]);

	return {
		isValidEntry,
		validationSuccess,
		previewSectionBlocks,
		hasInconvertible,
		inconvertibleTotalCount,
		firstInconvertibleHighlightLine,
	};
};
