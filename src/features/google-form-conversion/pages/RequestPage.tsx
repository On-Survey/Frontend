import { ValidationErrorBottomSheet } from "@features/google-form-conversion/components/ValidationErrorBottomSheet";
import { ValidationPartialBottomSheet } from "@features/google-form-conversion/components/ValidationPartialBottomSheet";
import { ValidationSuccessBottomSheet } from "@features/google-form-conversion/components/ValidationSuccessBottomSheet";
import { useOptionsFormReset } from "@features/google-form-conversion/context/OptionsFormContext";
import {
	useRequestEntryContext,
	useRequestForm,
	useRequestFormState,
} from "@features/google-form-conversion/context/RequestEntryContext";
import {
	useGoogleFormRequestValidation,
	type ValidateRequestResult,
} from "@features/google-form-conversion/hooks/useGoogleFormRequestValidation";
import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";
import type { RequestFormValues } from "@features/google-form-conversion/types";
import {
	getFormRequestValidationErrorMessage,
	getGoogleFormLinkValidationMessage,
	isContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { adaptive } from "@toss/tds-colors";
import {
	AgreementV4,
	FixedBottomCTA,
	Text,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const RequestPage = () => {
	const navigate = useNavigate();

	const { setAfterValidation } = useRequestEntryContext();
	const resetOptionsForm = useOptionsFormReset();

	const { mutateAsync: validateRequest, isPending: isValidating } =
		useGoogleFormRequestValidation();

	const [sheetTrigger, setSheetTrigger] = useState<
		ValidateRequestResult["type"] | null
	>(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [convertibleCount, setConvertibleCount] = useState(0);
	const [unsupportedDetails, setUnsupportedDetails] = useState<
		FormRequestValidationDetail[]
	>([]);

	const {
		control,
		handleSubmit: rhfHandleSubmit,
		trigger,
		formState: { errors },
	} = useRequestForm();

	const { formLink, email, emailSendAgreed } = useRequestFormState();

	const onSubmit = useCallback(
		async (data: RequestFormValues) => {
			try {
				setUnsupportedDetails([]);
				setConvertibleCount(0);
				setErrorMessage("");
				setSheetTrigger(null);

				const validation = await validateRequest({
					formLink: data.formLink.trim(),
					requesterEmail: data.email.trim(),
				});

				if (validation.type === "error") {
					setErrorMessage(validation.message);
					setSheetTrigger("error");
					return;
				}

				setAfterValidation({
					formLink: data.formLink.trim(),
					email: data.email.trim(),
					validationResult: validation.response,
				});
				setConvertibleCount(validation.convertibleCount);
				if (validation.type === "partial_success") {
					setUnsupportedDetails(validation.unsupportedDetails);
				}
				resetOptionsForm();
				setSheetTrigger(validation.type);
			} catch (e) {
				setErrorMessage(getFormRequestValidationErrorMessage(e));
				setSheetTrigger("error");
			}
		},
		[validateRequest, setAfterValidation, resetOptionsForm],
	);

	const handleSuccessSheetContinue = useCallback(() => {
		setSheetTrigger(null);
		navigate("/payment/google-form-conversion-options");
	}, [navigate]);

	const handleSuccessSheetEdit = useCallback(() => {
		setSheetTrigger(null);
	}, []);

	const handleErrorSheetClose = useCallback(() => {
		setErrorMessage("");
		setSheetTrigger(null);
	}, []);

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
						validate: (v) => {
							const value = v?.trim() ?? "";
							if (!value) return "폼 링크를 입력해주세요";
							const message = getGoogleFormLinkValidationMessage(value);
							return message ?? true;
						},
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
							onPaste={() => {
								// 붙여넣기 직후 값 반영 다음 틱에서 즉시 유효성 재검증
								setTimeout(() => {
									void trigger("formLink");
								}, 0);
							}}
							onBlur={onBlur}
						/>
					)}
				/>

				<Controller
					control={control}
					name="email"
					rules={{
						validate: (v) => {
							if (isContactEmail(v ?? "")) return true;
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

				<Controller
					control={control}
					name="emailSendAgreed"
					rules={{
						validate: (v) => v || "필수 동의가 필요해요",
					}}
					render={({ field: { onChange, value } }) => (
						<AgreementV4
							variant="medium"
							left={
								<div className="flex items-center">
									<AgreementV4.Checkbox
										variant="checkbox"
										checked={value}
										onChange={() => onChange(!value)}
									/>
									<Text
										color={adaptive.blue600}
										typography="t7"
										fontWeight="bold"
									>
										필수
									</Text>
								</div>
							}
							middle={<AgreementV4.Text>이메일 발신 동의</AgreementV4.Text>}
						/>
					)}
				/>
			</div>

			<FixedBottomCTA
				loading={isValidating}
				onClick={rhfHandleSubmit(onSubmit)}
				bottomAccessory={
					isValidating ? "최대 10초까지 소요 될 수 있어요" : undefined
				}
				disabled={
					isValidating ||
					!!errors.formLink ||
					!!errors.email ||
					!emailSendAgreed ||
					!formLink.trim() ||
					!isGoogleFormLinkUrl(formLink.trim()) ||
					!isContactEmail(email ?? "")
				}
			>
				구글폼 변환
			</FixedBottomCTA>

			{sheetTrigger === "partial_success" && (
				<ValidationPartialBottomSheet
					open={true}
					unsupportedDetails={unsupportedDetails}
					onClose={handleSuccessSheetEdit}
				/>
			)}

			{sheetTrigger === "success" && (
				<ValidationSuccessBottomSheet
					open={true}
					convertibleCount={convertibleCount}
					onClose={handleSuccessSheetEdit}
					onContinue={handleSuccessSheetContinue}
				/>
			)}

			{sheetTrigger === "error" && (
				<ValidationErrorBottomSheet
					open={true}
					message={errorMessage}
					onClose={handleErrorSheetClose}
				/>
			)}
		</>
	);
};
