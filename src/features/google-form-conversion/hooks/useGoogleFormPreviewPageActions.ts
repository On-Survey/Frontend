import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type UseGoogleFormPreviewPageActionsParams = {
	isValidEntry: boolean;
	hasInconvertible: boolean;
	isPreviewFromOptions: boolean;
};

/**
 * 미리보기 페이지: 유효하지 않으면 신청 페이지로 replace, 하단 CTA·미지원 확인 시트·문의 이동
 */
export const useGoogleFormPreviewPageActions = ({
	isValidEntry,
	hasInconvertible,
	isPreviewFromOptions,
}: UseGoogleFormPreviewPageActionsParams) => {
	const navigate = useNavigate();

	const [isUnsupportedRegisterSheetOpen, setIsUnsupportedRegisterSheetOpen] =
		useState(false);
	const pendingAfterUnsupportedConfirmRef = useRef<(() => void) | null>(null);

	const handleUnsupportedRegisterSheetClose = useCallback(() => {
		pendingAfterUnsupportedConfirmRef.current = null;
		setIsUnsupportedRegisterSheetOpen(false);
	}, []);

	const handleUnsupportedRegisterContinue = useCallback(() => {
		const run = pendingAfterUnsupportedConfirmRef.current;
		pendingAfterUnsupportedConfirmRef.current = null;
		setIsUnsupportedRegisterSheetOpen(false);
		run?.();
	}, []);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
		}
	}, [isValidEntry, navigate]);

	const handleContinueToOptions = useCallback(() => {
		const go = () => {
			navigate("/payment/google-form-conversion-options");
		};
		if (hasInconvertible) {
			pendingAfterUnsupportedConfirmRef.current = go;
			setIsUnsupportedRegisterSheetOpen(true);
			return;
		}
		go();
	}, [navigate, hasInconvertible]);

	const handlePreviewPrimaryCta = useCallback(() => {
		if (isPreviewFromOptions) {
			navigate(-1);
			return;
		}
		handleContinueToOptions();
	}, [isPreviewFromOptions, navigate, handleContinueToOptions]);

	const previewPrimaryCtaLabel = isPreviewFromOptions
		? "나가기"
		: "다음 단계로";

	const goToInquiry = useCallback(() => {
		navigate("/payment/google-form-conversion-inquiry");
	}, [navigate]);

	return {
		handlePreviewPrimaryCta,
		previewPrimaryCtaLabel,
		goToInquiry,
		isUnsupportedRegisterSheetOpen,
		handleUnsupportedRegisterSheetClose,
		handleUnsupportedRegisterContinue,
	};
};
