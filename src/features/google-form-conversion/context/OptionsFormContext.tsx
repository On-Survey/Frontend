import {
	DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM,
	type OptionsFormValues,
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

interface OptionsFormProviderProps {
	children: ReactNode;
}

export function OptionsFormProvider({ children }: OptionsFormProviderProps) {
	const methods = useForm<OptionsFormValues>({
		mode: "onChange",
		defaultValues: DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM,
	});

	return <FormProvider {...methods}>{children}</FormProvider>;
}

/** 옵션·스크리닝 폼 값 구독 (TrainReservation `useTrainReservationFormContext`와 동일 역할) */
export function useOptionsFormContext(): OptionsFormValues {
	const { control } = useFormContext<OptionsFormValues>();
	const values = useWatch({
		control,
		defaultValue: DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM,
	});
	return (values ??
		DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM) as OptionsFormValues;
}

export function useOptionsForm(): UseFormReturn<OptionsFormValues> {
	return useFormContext<OptionsFormValues>();
}

export function useOptionsFormReset(): () => void {
	const { reset } = useFormContext<OptionsFormValues>();
	return useCallback(() => {
		reset(DEFAULT_GOOGLE_FORM_CONVERSION_OPTIONS_FORM);
	}, [reset]);
}
