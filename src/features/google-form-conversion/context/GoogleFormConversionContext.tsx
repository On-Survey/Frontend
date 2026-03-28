import type { FormRequestValidationResponse } from "@features/google-form-conversion/service/api";
import type { GoogleFormConversionScreeningDraft } from "@features/google-form-conversion/types";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export type GoogleFormConversionContextValue = {
	formLink: string | null;
	email: string | null;
	validationResult: FormRequestValidationResponse | null;
	screening: GoogleFormConversionScreeningDraft | null;
	/** 검증 API 성공 직후 폼 링크·이메일·검증 결과 저장 (스크리닝 초기화) */
	setAfterValidation: (payload: {
		formLink: string;
		email: string;
		validationResult: FormRequestValidationResponse;
	}) => void;
	setScreening: (screening: GoogleFormConversionScreeningDraft | null) => void;
	/** 플로우 진입 시 또는 완료 후 초기화 */
	resetFlow: () => void;
};

const GoogleFormConversionContext =
	createContext<GoogleFormConversionContextValue | null>(null);

export function GoogleFormConversionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [formLink, setFormLink] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [validationResult, setValidationResult] =
		useState<FormRequestValidationResponse | null>(null);
	const [screening, setScreeningState] =
		useState<GoogleFormConversionScreeningDraft | null>(null);

	const setAfterValidation = useCallback(
		(payload: {
			formLink: string;
			email: string;
			validationResult: FormRequestValidationResponse;
		}) => {
			setFormLink(payload.formLink.trim());
			setEmail(payload.email.trim());
			setValidationResult(payload.validationResult);
			setScreeningState(null);
		},
		[],
	);

	const setScreening = useCallback(
		(next: GoogleFormConversionScreeningDraft | null) => {
			setScreeningState(next);
		},
		[],
	);

	const resetFlow = useCallback(() => {
		setFormLink(null);
		setEmail(null);
		setValidationResult(null);
		setScreeningState(null);
	}, []);

	const value = useMemo(
		(): GoogleFormConversionContextValue => ({
			formLink,
			email,
			validationResult,
			screening,
			setAfterValidation,
			setScreening,
			resetFlow,
		}),
		[
			formLink,
			email,
			validationResult,
			screening,
			setAfterValidation,
			setScreening,
			resetFlow,
		],
	);

	return (
		<GoogleFormConversionContext.Provider value={value}>
			{children}
		</GoogleFormConversionContext.Provider>
	);
}

export function useGoogleFormConversion(): GoogleFormConversionContextValue {
	const ctx = useContext(GoogleFormConversionContext);
	if (!ctx) {
		throw new Error(
			"useGoogleFormConversion는 GoogleFormConversionProvider 안에서만 사용할 수 있어요",
		);
	}
	return ctx;
}
