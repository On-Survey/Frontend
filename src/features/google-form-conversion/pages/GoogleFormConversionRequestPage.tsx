import { GoogleFormConversionValidationErrorBottomSheet } from "@features/google-form-conversion/components/GoogleFormConversionValidationErrorBottomSheet";
import { GoogleFormConversionValidationSuccessBottomSheet } from "@features/google-form-conversion/components/GoogleFormConversionValidationSuccessBottomSheet";
import { useGoogleFormRequestValidation } from "@features/google-form-conversion/hooks/useGoogleFormRequestValidation";
import type { FormRequestValidationResponse } from "@features/google-form-conversion/service/api";
import type { FormValues } from "@features/google-form-conversion/types";
import {
	getConvertibleQuestionCountFromValidation,
	getFormRequestValidationErrorMessage,
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, TextField, Top, useWebToast } from "@toss/tds-mobile";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const VALIDATION_WAIT_TOAST_OPTIONS = {
	type: "bottom" as const,
	lottie: "https://static.toss.im/lotties-common/alarm-spot.json",
	higherThanCTA: true,
};

type SuccessSheetPayload = {
	formLink: string;
	email: string;
	validationResult: FormRequestValidationResponse;
};

export const GoogleFormConversionRequestPage = () => {
	const navigate = useNavigate();
	const { openToast, closeToast } = useWebToast();
	const { mutateAsync: validateRequest, isPending: isValidating } =
		useGoogleFormRequestValidation();

	const [successSheet, setSuccessSheet] = useState<SuccessSheetPayload | null>(
		null,
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		control,
		watch,
		handleSubmit: rhfHandleSubmit,
		formState: { errors },
	} = useForm<Pick<FormValues, "formLink" | "email">>({
		mode: "onChange",
		defaultValues: {
			formLink: "",
			email: "",
		},
	});

	const formLink = watch("formLink");

	const onSubmit = useCallback(
		async (data: Pick<FormValues, "formLink" | "email">) => {
			try {
				openToast(
					"폼을 확인하고 있어요. 잠시만 기다려주세요.",
					VALIDATION_WAIT_TOAST_OPTIONS,
				);
				const res = await validateRequest({
					formLink: data.formLink.trim(),
					requesterEmail: data.email.trim(),
				});
				if (!res.success) {
					closeToast();
					setErrorMessage(res.message || "검증에 실패했어요");
					return;
				}
				closeToast();
				setSuccessSheet({
					formLink: data.formLink.trim(),
					email: data.email.trim(),
					validationResult: res,
				});
			} catch (e) {
				closeToast();
				setErrorMessage(getFormRequestValidationErrorMessage(e));
			}
		},
		[closeToast, openToast, validateRequest],
	);

	const handleSuccessSheetContinue = useCallback(() => {
		if (!successSheet) return;
		const { formLink: fl, email: em, validationResult } = successSheet;
		setSuccessSheet(null);
		navigate("/payment/google-form-conversion-options", {
			state: {
				formLink: fl,
				email: em,
				validationResult,
			},
		});
	}, [navigate, successSheet]);

	const handleSuccessSheetEdit = useCallback(() => {
		setSuccessSheet(null);
	}, []);

	const handleErrorSheetClose = useCallback(() => {
		setErrorMessage(null);
	}, []);

	const convertibleCount = successSheet
		? getConvertibleQuestionCountFromValidation(successSheet.validationResult)
		: 0;

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 정보를 입력해주세요
					</Top.TitleParagraph>
				}
				lowerGap={0}
			/>

			<div className="flex flex-col gap-4 px-2 pt-4">
				<Controller
					control={control}
					name="formLink"
					rules={{
						required: "폼 링크를 입력해주세요",
						validate: (v) =>
							isGoogleFormLinkUrl(v?.trim() ?? "") ||
							"링크를 다시 한번 확인해 주세요!",
					}}
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!errors.formLink}
							label="폼 링크"
							labelOption="sustain"
							help={
								errors.formLink?.message ??
								'공유 > 편집자 보기 "링크가 있는 모든 사용자로 변경" 해주세요'
							}
							value={value}
							placeholder="https://docs.google.com/..."
							suffix=""
							prefix=""
							onChange={(e) => onChange(e.target.value)}
							onBlur={onBlur}
						/>
					)}
				/>

				<Controller
					control={control}
					name="email"
					rules={{
						validate: (v) => {
							if (isGoogleFormConversionContactEmail(v ?? "")) return true;
							const trimmed = (v ?? "").trim();
							return trimmed.length > 0
								? "올바른 이메일 형식을 입력해주세요"
								: "이메일을 입력해주세요";
						},
					}}
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!errors.email}
							label="이메일"
							labelOption="sustain"
							help={errors.email?.message ?? "안내 받을 이메일을 입력해 주세요"}
							value={value}
							placeholder="example@toss.im"
							suffix=""
							prefix=""
							onChange={(e) => onChange(e.target.value)}
							onBlur={onBlur}
						/>
					)}
				/>
			</div>

			<FixedBottomCTA
				loading={isValidating}
				onClick={rhfHandleSubmit(onSubmit)}
				disabled={
					isValidating ||
					!!errors.formLink ||
					!!errors.email ||
					!formLink.trim() ||
					!isGoogleFormLinkUrl(formLink.trim()) ||
					!isGoogleFormConversionContactEmail(watch("email") ?? "")
				}
			>
				구글폼 변환
			</FixedBottomCTA>

			<GoogleFormConversionValidationSuccessBottomSheet
				open={successSheet != null}
				convertibleCount={convertibleCount}
				onClose={handleSuccessSheetEdit}
				onContinue={handleSuccessSheetContinue}
			/>

			<GoogleFormConversionValidationErrorBottomSheet
				open={errorMessage != null}
				message={errorMessage ?? ""}
				onClose={handleErrorSheetClose}
			/>
		</>
	);
};
