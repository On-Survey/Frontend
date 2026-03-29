import type { FormRequestValidationSuccessResultItem } from "@features/google-form-conversion/service/api";

/**
 * 미지원 문항 존재 여부.
 * 백엔드에 따라 `inconvertibleDetails`만 오거나 `inconvertible` 카운트만 올 수 있어 둘 다 본다.
 */
export function hasInconvertibleFromValidationSuccess(
	success: FormRequestValidationSuccessResultItem | null | undefined,
): boolean {
	if (!success) return false;
	const details = success.inconvertibleDetails ?? [];
	if (details.length > 0) return true;
	return (success.inconvertible ?? 0) > 0;
}
