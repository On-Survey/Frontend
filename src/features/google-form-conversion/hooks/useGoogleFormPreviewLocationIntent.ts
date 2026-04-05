import type { GoogleFormConversionPreviewLocationState } from "@features/google-form-conversion/lib/previewPageLocationState";
import { useLocation } from "react-router-dom";

/** 미리보기 진입 경로(옵션 vs 플로우)·첫 미변환 포커스 플래그 */
export const useGoogleFormPreviewLocationIntent = () => {
	const location = useLocation();
	const state =
		(location.state as GoogleFormConversionPreviewLocationState | null) ?? null;

	return {
		isPreviewFromOptions: state?.previewFrom === "options",
		focusFirstInconvertibleFromNav: state?.focusFirstInconvertible === true,
		locationKey: location.key,
	};
};
