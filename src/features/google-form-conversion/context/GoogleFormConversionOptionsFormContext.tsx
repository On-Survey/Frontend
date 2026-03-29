import {
	DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM,
	type GoogleFormConversionOptionsFormValues,
} from "@features/google-form-conversion/types";
import type { ReactNode } from "react";
import { useCallback } from "react";
import {
	FormProvider,
	type UseFormReturn,
	useForm,
	useFormContext,
	useWatch,
} from "react-hook-form";

interface GoogleFormConversionOptionsFormProviderProps {
	children: ReactNode;
}

export function GoogleFormConversionOptionsFormProvider({
	children,
}: GoogleFormConversionOptionsFormProviderProps) {
	const methods = useForm<GoogleFormConversionOptionsFormValues>({
		mode: "onChange",
		defaultValues: DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM,
	});

	return <FormProvider {...methods}>{children}</FormProvider>;
}

/** 옵션·스크리닝 폼 값 구독 (TrainReservation `useTrainReservationFormContext`와 동일 역할) */
export function useGoogleFormConversionOptionsFormContext(): GoogleFormConversionOptionsFormValues {
	const { control } = useFormContext<GoogleFormConversionOptionsFormValues>();
	const values = useWatch({
		control,
		defaultValue: DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM,
	});
	return (values ??
		DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM) as GoogleFormConversionOptionsFormValues;
}

export function useGoogleFormConversionOptionsForm(): UseFormReturn<GoogleFormConversionOptionsFormValues> {
	return useFormContext<GoogleFormConversionOptionsFormValues>();
}

export function useGoogleFormConversionOptionsFormReset(): () => void {
	const { reset } = useFormContext<GoogleFormConversionOptionsFormValues>();
	return useCallback(() => {
		reset(DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM);
	}, [reset]);
}
