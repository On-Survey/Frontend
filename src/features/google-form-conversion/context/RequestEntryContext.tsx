import type { FormRequestValidationResponse } from "@features/google-form-conversion/service/api";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

/**
 * 관심사: 구글폼 전환 플로우의 "요청 진입 정보" 상태만 관리한다.
 * - 폼 링크/연락 이메일
 * - 폼 검증 API 응답
 */
export type RequestEntryContextValue = {
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

const RequestEntryContext = createContext<RequestEntryContextValue | null>(
	null,
);

export function RequestEntryProvider({ children }: { children: ReactNode }) {
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
		(): RequestEntryContextValue => ({
			formLink,
			email,
			validationResult,
			setAfterValidation,
			resetFlow,
		}),
		[formLink, email, validationResult, setAfterValidation, resetFlow],
	);

	return (
		<RequestEntryContext.Provider value={value}>
			{children}
		</RequestEntryContext.Provider>
	);
}

export function useRequestEntryContext(): RequestEntryContextValue {
	const ctx = useContext(RequestEntryContext);
	if (!ctx) {
		throw new Error(
			"useRequestEntryContext는 RequestEntryProvider 안에서만 사용할 수 있어요",
		);
	}
	return ctx;
}
