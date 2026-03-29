import type { FormRequestValidationResponse } from "@features/google-form-conversion/service/api";
import {
	DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM,
	type RequestFormValues,
} from "@features/google-form-conversion/types";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { type UseFormReturn, useForm, useWatch } from "react-hook-form";

/**
 * 검증 API 응답만 별도 보관. 링크·이메일·동의는 요청 폼 RHF와 동기화한다.
 * 옵션 폼과 `FormProvider`를 겹치지 않기 위해 요청 폼은 동일 컨텍스트의 `form`으로만 노출한다.
 */
export type RequestEntryContextValue = {
	validationResult: FormRequestValidationResponse | null;
	setAfterValidation: (payload: {
		formLink: string;
		email: string;
		validationResult: FormRequestValidationResponse;
	}) => void;
	resetFlow: () => void;
};

type RequestEntryProviderValue = RequestEntryContextValue & {
	form: UseFormReturn<RequestFormValues, unknown, RequestFormValues>;
};

const RequestEntryContext = createContext<RequestEntryProviderValue | null>(
	null,
);

export function RequestEntryProvider({ children }: { children: ReactNode }) {
	const form = useForm<RequestFormValues>({
		mode: "onChange",
		defaultValues: DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM,
	});

	const { reset } = form;

	const [validationResult, setValidationResult] =
		useState<FormRequestValidationResponse | null>(null);

	const setAfterValidation = useCallback(
		(payload: {
			formLink: string;
			email: string;
			validationResult: FormRequestValidationResponse;
		}) => {
			reset({
				formLink: payload.formLink,
				email: payload.email,
				emailSendAgreed: true,
			});
			setValidationResult(payload.validationResult);
		},
		[reset],
	);

	const resetFlow = useCallback(() => {
		reset(DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM);
		setValidationResult(null);
	}, [reset]);

	const value = useMemo(
		(): RequestEntryProviderValue => ({
			validationResult,
			setAfterValidation,
			resetFlow,
			form,
		}),
		[validationResult, setAfterValidation, resetFlow, form],
	);

	return (
		<RequestEntryContext.Provider value={value}>
			{children}
		</RequestEntryContext.Provider>
	);
}

function useRequestEntryProviderValue(): RequestEntryProviderValue {
	const ctx = useContext(RequestEntryContext);
	if (!ctx) {
		throw new Error(
			"RequestEntry 관련 훅은 RequestEntryProvider 안에서만 사용할 수 있어요",
		);
	}
	return ctx;
}

/** 요청 폼 값 구독 (`useOptionsFormContext`와 동일 패턴) */
export function useRequestFormContext(): RequestFormValues {
	const { form } = useRequestEntryProviderValue();
	const { control } = form;
	const values = useWatch({
		control,
		defaultValue: DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM,
	});
	return (values ??
		DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM) as RequestFormValues;
}

export function useRequestForm(): UseFormReturn<
	RequestFormValues,
	unknown,
	RequestFormValues
> {
	return useRequestEntryProviderValue().form;
}

export function useRequestFormReset(): () => void {
	const { reset } = useRequestForm();
	return useCallback(() => {
		reset(DEFAULT_GOOGLE_FORM_CONVERSION_REQUEST_FORM);
	}, [reset]);
}

export function useRequestEntryContext(): RequestEntryContextValue {
	const { validationResult, setAfterValidation, resetFlow } =
		useRequestEntryProviderValue();
	return { validationResult, setAfterValidation, resetFlow };
}
