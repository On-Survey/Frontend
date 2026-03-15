import {
	PRICE_TABLE,
	RESPONDENT_OPTIONS,
} from "@features/google-form-conversion/constants";
import {
	getGoogleFormPreview,
	validatePromotionCode,
} from "@features/google-form-conversion/service/api";
import type {
	FormValues,
	QuestionPackage,
	RespondentCount,
} from "@features/google-form-conversion/types";
import {
	formatDate,
	formatDateToISO,
	formatPrice,
	getDefaultDeadline,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { DateSelectBottomSheet } from "@features/payment/components/payment";
import { AgeMultiSelectBottomSheet } from "@features/payment/components/payment/bottomSheet/AgeMultiSelectBottomSheet";
import {
	AGE,
	formatAgeDisplay,
	GENDER,
	type GenderCode,
	getGenderLabel,
} from "@features/payment/constants/payment";
import { pushGtmEvent } from "@shared/lib/gtm";
import { validateEmail } from "@shared/lib/validators";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomSheet,
	FixedBottomCTA,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionRequestPage = () => {
	const navigate = useNavigate();
	const [formQuestionCount, setFormQuestionCount] = useState<number | null>(
		null,
	);
	const [promotionCodeError, setPromotionCodeError] = useState<string | null>(
		null,
	);
	const [isRespondentSheetOpen, setIsRespondentSheetOpen] = useState(false);
	const [isGenderSheetOpen, setIsGenderSheetOpen] = useState(false);
	const [isAgeSheetOpen, setIsAgeSheetOpen] = useState(false);

	const questionPackage: QuestionPackage = "light";

	const {
		control,
		watch,
		setValue,
		handleSubmit: rhfHandleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		mode: "onChange",
		defaultValues: {
			formLink: "",
			email: "",
			promotionCode: "",
			respondentCount: 50,
			deadline: getDefaultDeadline(),
			gender: "ALL",
			ages: ["ALL"],
		},
	});

	const formLink = watch("formLink");
	const respondentCount = watch("respondentCount");
	const deadline = watch("deadline");
	const gender = watch("gender");
	const ages = watch("ages");

	const price = useMemo(
		() => PRICE_TABLE[questionPackage][respondentCount],
		[respondentCount],
	);

	// 폼 링크가 유효할 때만 서버에서 문항 수 조회 (밸리데이션만, 디바운스 없음)
	useEffect(() => {
		const trimmed = formLink.trim();
		if (!trimmed || !isGoogleFormLinkUrl(trimmed)) {
			setFormQuestionCount(null);
			return;
		}
		getGoogleFormPreview(trimmed)
			.then((res) => setFormQuestionCount(res.questionCount))
			.catch(() => setFormQuestionCount(null));
	}, [formLink]);

	const onSubmit = useCallback(
		async (data: FormValues) => {
			pushGtmEvent({
				event: "form_payment_button_click",
				pagePath: "/payment/google-form-conversion",
			});
			setPromotionCodeError(null);

			const code = data.promotionCode?.trim();
			if (code) {
				try {
					const { valid } = await validatePromotionCode(code);
					if (valid) {
						// TODO: 프로모션 전용 페이지 라우트 추가 후 해당 경로로 이동
						navigate("/payment/google-form-conversion-promo-success", {
							state: {
								formLink: data.formLink,
								email: data.email,
								questionPackage,
								respondentCount: data.respondentCount,
								gender: data.gender,
								ages: data.ages,
								deadlineText: formatDate(data.deadline),
								deadline: formatDateToISO(data.deadline),
								price,
								promotionCode: code,
							},
						});
						return;
					}
				} catch {
					// noop
				}
				setPromotionCodeError("유효하지 않은 프로모션 코드예요");
				return;
			}

			navigate("/payment/google-form-conversion-check", {
				state: {
					formLink: data.formLink,
					email: data.email,
					questionPackage,
					respondentCount: data.respondentCount,
					gender: data.gender,
					ages: data.ages,
					deadlineText: formatDate(data.deadline),
					deadline: formatDateToISO(data.deadline),
					price,
				},
			});
		},
		[navigate, price],
	);

	const handleDateChange = (date: Date) => {
		setValue("deadline", date);
	};

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
				<TextField.Button
					variant="line"
					hasError={false}
					label="희망 응답자 수"
					value={
						RESPONDENT_OPTIONS.find(
							(option) => option.value === respondentCount,
						)?.display ?? ""
					}
					placeholder="희망 응답자 수"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsRespondentSheetOpen(true)}
				/>

				<Controller
					control={control}
					name="formLink"
					rules={{
						required: "폼 링크를 입력해주세요",
						validate: (v) =>
							isGoogleFormLinkUrl(v?.trim() ?? "") || "구글폼 링크가 아니에요",
					}}
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!errors.formLink}
							label="폼 링크"
							labelOption="sustain"
							help={errors.formLink?.message ?? "구글 폼 링크를 등록해주세요"}
							value={value}
							placeholder="https://docs.google.com/..."
							suffix=""
							prefix=""
							onChange={(e) => onChange(e.target.value)}
							onBlur={onBlur}
						/>
					)}
				/>

				<TextField.Clearable
					variant="line"
					hasError={false}
					label="문항 수"
					labelOption="sustain"
					value={formQuestionCount !== null ? `${formQuestionCount}개` : ""}
					placeholder="폼 링크 입력 시 자동으로 표시돼요"
					readOnly
					suffix=""
					prefix=""
					onChange={() => {}}
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="성별"
					labelOption="sustain"
					help="특정 성별만 선택하면 추가 비용이 발생해요"
					value={getGenderLabel(gender)}
					placeholder="성별을 선택해주세요"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsGenderSheetOpen(true)}
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="연령대"
					labelOption="sustain"
					help="복수 선택 시 추가 요금이 부과되고, 전체 선택 시는 제외돼요."
					value={formatAgeDisplay(ages)}
					placeholder="연령대를 선택해주세요"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsAgeSheetOpen(true)}
				/>

				<DateSelectBottomSheet value={deadline} onChange={handleDateChange} />

				<Controller
					control={control}
					name="email"
					rules={{
						required: "이메일을 입력해주세요",
						validate: (v) =>
							validateEmail(v ?? "") || "올바른 이메일 형식을 입력해주세요",
					}}
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!errors.email}
							label="이메일"
							labelOption="sustain"
							help={
								errors.email?.message ??
								"설문 등록 과정을 안내받으실 이메일을 입력해주세요"
							}
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
					name="promotionCode"
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!promotionCodeError}
							label="프로모션 코드"
							labelOption="sustain"
							help={
								promotionCodeError ?? "선택 입력이에요. 있으시면 입력해주세요"
							}
							value={value ?? ""}
							placeholder="프로모션 코드 입력"
							suffix=""
							prefix=""
							onChange={(e) => {
								onChange(e.target.value);
								setPromotionCodeError(null);
							}}
							onBlur={onBlur}
						/>
					)}
				/>
			</div>

			<BottomSheet
				header={
					<BottomSheet.Header>희망 응답자 수를 선택해주세요</BottomSheet.Header>
				}
				open={isRespondentSheetOpen}
				onClose={() => setIsRespondentSheetOpen(false)}
				cta={[]}
			>
				<div>
					<BottomSheet.Select
						value={String(respondentCount)}
						options={RESPONDENT_OPTIONS.map((option) => ({
							name: option.label,
							value: String(option.value),
							hideUnCheckedCheckBox: option.value !== respondentCount,
						}))}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setValue(
								"respondentCount",
								Number(e.target.value) as RespondentCount,
							);
						}}
					/>
				</div>
			</BottomSheet>

			<BottomSheet
				header={
					<BottomSheet.Header>대상 성별을 설정해주세요</BottomSheet.Header>
				}
				open={isGenderSheetOpen}
				onClose={() => setIsGenderSheetOpen(false)}
				cta={[]}
			>
				<div className="mb-4">
					<BottomSheet.Select
						value={gender}
						options={GENDER.map((option) => ({
							name: option.name,
							value: option.value,
							hideUnCheckedCheckBox: option.value !== gender,
						}))}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setValue("gender", e.target.value as GenderCode);
						}}
					/>
				</div>
			</BottomSheet>

			<AgeMultiSelectBottomSheet
				isOpen={isAgeSheetOpen}
				handleClose={() => setIsAgeSheetOpen(false)}
				options={AGE}
				value={ages}
				onConfirm={(value) => setValue("ages", value)}
				title="대상 연령대를 선택해주세요"
			/>

			<FixedBottomCTA
				loading={false}
				onClick={rhfHandleSubmit(onSubmit)}
				disabled={
					!!errors.formLink ||
					!!errors.email ||
					!formLink.trim() ||
					!isGoogleFormLinkUrl(formLink.trim()) ||
					!validateEmail(watch("email"))
				}
			>
				{formatPrice(price)}원 결제하기
			</FixedBottomCTA>
		</>
	);
};
