import type { FormRequestValidationResponse } from "@features/google-form-conversion/service/api";
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
	/** 검증 API 성공 직후 폼 링크·이메일·검증 결과 저장 */
	setAfterValidation: (payload: {
		formLink: string;
		email: string;
		validationResult: FormRequestValidationResponse;
	}) => void;
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

	const setAfterValidation = useCallback(
		(payload: {
			formLink: string;
			email: string;
			validationResult: FormRequestValidationResponse;
		}) => {
			setFormLink(payload.formLink.trim());
			setEmail(payload.email.trim());
			setValidationResult(payload.validationResult);
		},
		[],
	);

	const resetFlow = useCallback(() => {
		setFormLink(null);
		setEmail(null);
		setValidationResult(null);
	}, []);

	const value = useMemo(
		(): GoogleFormConversionContextValue => ({
			formLink,
			email,
			validationResult,
			setAfterValidation,
			resetFlow,
		}),
		[formLink, email, validationResult, setAfterValidation, resetFlow],
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
