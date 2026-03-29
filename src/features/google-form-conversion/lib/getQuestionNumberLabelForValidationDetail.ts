import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";

export function getQuestionNumberLabelForValidationDetail(
	detail: FormRequestValidationDetail,
	listIndex: number,
): string {
	const order = detail.questionOrder ?? listIndex + 1;
	return `${order}번 문항`;
}
