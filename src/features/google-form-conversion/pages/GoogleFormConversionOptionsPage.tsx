import type { Interest } from "@features/create-survey/service/form/types";
import { GoogleFormConversionScreeningListRow } from "@features/google-form-conversion/components/GoogleFormConversionScreeningListRow";
import { InterestSelectBottomSheet } from "@features/google-form-conversion/components/InterestSelectBottomSheet";
import { RESPONDENT_OPTIONS } from "@features/google-form-conversion/constants";
import {
	getGoogleFormPreview,
	validateDiscountCode,
} from "@features/google-form-conversion/service/api";
import type {
	FormValues,
	GoogleFormConversionFlowState,
	QuestionPackage,
	RespondentCount,
} from "@features/google-form-conversion/types";
import {
	formatDateToISO,
	formatInterestSelectionDisplay,
	formatPrice,
	getDefaultDeadline,
	getGoogleFormConversionPrice,
	getGoogleFormConversionPromoPrice,
	getQuestionRange,
	getTargetingCase,
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { AgeMultiSelectBottomSheet } from "@features/payment/components/payment/bottomSheet/AgeMultiSelectBottomSheet";
import {
	AGE,
	formatAgeDisplay,
	GENDER,
	type GenderCode,
	getGenderLabel,
} from "@features/payment/constants/payment";
import { topics } from "@shared/constants/topics";
import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	BottomSheet,
	Button,
	FixedBottomCTA,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

export const GoogleFormConversionOptionsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const entryState = location.state as
		| GoogleFormConversionFlowState
		| undefined;

	const formLinkFromState = entryState?.formLink?.trim() ?? "";
	const emailFromState = entryState?.email ?? "";
	const isValidEntry =
		!!formLinkFromState &&
		isGoogleFormLinkUrl(formLinkFromState) &&
		isGoogleFormConversionContactEmail(emailFromState);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
		}
	}, [isValidEntry, navigate]);

	const [formQuestionCount, setFormQuestionCount] = useState<number | null>(
		null,
	);
	const [promotionCodeError, setPromotionCodeError] = useState<string | null>(
		null,
	);
	const [promotionVerifyMessage, setPromotionVerifyMessage] = useState<
		string | null
	>(null);
	const [isPromotionVerifying, setIsPromotionVerifying] = useState(false);
	const [isRespondentSheetOpen, setIsRespondentSheetOpen] = useState(false);
	const [isGenderSheetOpen, setIsGenderSheetOpen] = useState(false);
	const [isAgeSheetOpen, setIsAgeSheetOpen] = useState(false);
	const [isInterestSheetOpen, setIsInterestSheetOpen] = useState(false);

	const questionPackage: QuestionPackage = "light";

	const {
		control,
		watch,
		getValues,
		setValue,
		handleSubmit: rhfHandleSubmit,
	} = useForm<FormValues>({
		mode: "onChange",
		defaultValues: {
			formLink: formLinkFromState,
			email: emailFromState,
			promotionCode: "",
			respondentCount: 50,
			residence: "ALL",
			interestIds: [],
			gender: "ALL",
			ages: ["ALL"],
		},
	});

	const formLink = watch("formLink");
	const respondentCount = watch("respondentCount");
	const interestIds = watch("interestIds");
	const promotionCodeInput = watch("promotionCode");
	const gender = watch("gender");
	const ages = watch("ages");

	const price = useMemo(() => {
		const questionRange = getQuestionRange(formQuestionCount);
		const targetingCase = getTargetingCase(gender, ages);
		return getGoogleFormConversionPrice(
			respondentCount,
			questionRange,
			targetingCase,
		);
	}, [respondentCount, formQuestionCount, gender, ages]);

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

	const handleVerifyPromotion = useCallback(async () => {
		const code = getValues("promotionCode")?.trim() ?? "";
		if (!code) {
			setPromotionVerifyMessage(null);
			setPromotionCodeError("프로모션 코드를 입력해주세요");
			return;
		}
		setIsPromotionVerifying(true);
		setPromotionCodeError(null);
		setPromotionVerifyMessage(null);
		try {
			const { valid } = await validateDiscountCode(code);
			if (valid) {
				setPromotionVerifyMessage("인증되었어요");
			} else {
				setPromotionCodeError("유효하지 않은 프로모션 코드예요");
			}
		} catch {
			setPromotionCodeError("인증에 실패했어요. 다시 시도해주세요");
		} finally {
			setIsPromotionVerifying(false);
		}
	}, [getValues]);

	const onSubmit = useCallback(
		async (data: FormValues) => {
			pushGtmEvent({
				event: "form_payment_button_click",
				pagePath: "/payment/google-form-conversion-options",
			});
			setPromotionCodeError(null);

			const interestsPayload =
				data.interestIds.length > 0
					? data.interestIds
							.map((id) => topics.find((t) => t.id === id)?.value)
							.filter((v): v is Interest => v != null)
					: undefined;

			const code = data.promotionCode?.trim();
			if (code) {
				try {
					const { valid } = await validateDiscountCode(code);
					if (valid) {
						const questionRange = getQuestionRange(formQuestionCount);
						const targetingCase = getTargetingCase(data.gender, data.ages);
						const promoPrice = getGoogleFormConversionPromoPrice(
							data.respondentCount,
							questionRange,
							targetingCase,
						);
						navigate("/payment/google-form-conversion-promo-success", {
							state: {
								formLink: data.formLink,
								email: data.email,
								questionPackage,
								respondentCount: data.respondentCount,
								gender: data.gender,
								ages: data.ages,
								residence: data.residence,
								...(interestsPayload && { interests: interestsPayload }),
								deadline: formatDateToISO(getDefaultDeadline()),
								price: promoPrice,
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
					formQuestionCount,
					respondentCount: data.respondentCount,
					gender: data.gender,
					ages: data.ages,
					residence: data.residence,
					...(interestsPayload && { interests: interestsPayload }),
					deadline: formatDateToISO(getDefaultDeadline()),
					price,
				},
			});
		},
		[navigate, price, formQuestionCount],
	);

	if (!isValidEntry) {
		return null;
	}

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 세그먼트와 마감일을
						<br />
						선택해주세요
					</Top.TitleParagraph>
				}
				lowerGap={0}
			/>

			<div className="flex flex-col gap-4 px-2 pt-4">
				<GoogleFormConversionScreeningListRow
					flowState={{
						formLink: formLinkFromState,
						email: emailFromState,
						screening: entryState?.screening,
					}}
				/>
				<Border variant="height16" />
				<TextField.Clearable
					variant="line"
					hasError={false}
					label="문항 수"
					labelOption="sustain"
					help="선택 입력 없이 폼 링크 기준으로 자동 표시돼요"
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
					label="희망 응답자 수 (필수)"
					labelOption="sustain"
					help="반드시 선택해주세요"
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

				<TextField.Button
					variant="line"
					hasError={false}
					label="관심사 (필수)"
					labelOption="sustain"
					help="반드시 한 개 이상 선택해주세요"
					value={formatInterestSelectionDisplay(interestIds)}
					placeholder="관심사를 선택해주세요"
					right={
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name="icon-arrow-down-mono"
							color={adaptive.grey400}
							aria-hidden={true}
						/>
					}
					onClick={() => setIsInterestSheetOpen(true)}
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="연령대 (선택)"
					labelOption="sustain"
					help="선택 입력이에요. 복수 선택 시 추가 요금이 부과되고, 전체 선택 시는 제외돼요."
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

				<TextField.Button
					variant="line"
					hasError={false}
					label="성별 (선택)"
					labelOption="sustain"
					help="선택 입력이에요. 특정 성별만 선택하면 추가 비용이 발생해요"
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
					disabled={true}
					label="거주지 (선택)"
					labelOption="sustain"
					help="준비 중이에요. 지금은 전체 지역 기준으로 안내돼요."
					value="준비 중"
					placeholder="준비 중"
					right={undefined}
				/>

				<Controller
					control={control}
					name="promotionCode"
					render={({ field: { onChange, value, onBlur } }) => (
						<div className="flex gap-2 items-center">
							<div className="min-w-0 flex-1">
								<TextField.Clearable
									variant="line"
									hasError={!!promotionCodeError}
									label="프로모션 코드"
									labelOption="sustain"
									help={
										promotionCodeError ??
										promotionVerifyMessage ??
										"선택 입력이에요. 있으시면 입력해주세요"
									}
									value={value ?? ""}
									placeholder="프로모션 코드 입력"
									suffix=""
									prefix=""
									onChange={(e) => {
										onChange(e.target.value);
										setPromotionCodeError(null);
										setPromotionVerifyMessage(null);
									}}
									onBlur={onBlur}
								/>
							</div>
							<Button
								type="button"
								size="medium"
								variant="weak"
								loading={isPromotionVerifying}
								disabled={!promotionCodeInput?.trim()}
								className="shrink-0"
								onClick={() => void handleVerifyPromotion()}
							>
								인증하기
							</Button>
						</div>
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

			<InterestSelectBottomSheet
				open={isInterestSheetOpen}
				onClose={() => setIsInterestSheetOpen(false)}
				value={interestIds}
				onConfirm={(value) => setValue("interestIds", value)}
			/>

			<FixedBottomCTA
				loading={false}
				onClick={rhfHandleSubmit(onSubmit)}
				disabled={interestIds.length === 0}
			>
				{formatPrice(price)}원 결제하기
			</FixedBottomCTA>
		</>
	);
};
