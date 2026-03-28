import type { Interest } from "@features/create-survey/service/form/types";
import { GenderSelectBottomSheet } from "@features/google-form-conversion/components/GenderSelectBottomSheet";
import { GoogleFormConversionScreeningListRow } from "@features/google-form-conversion/components/GoogleFormConversionScreeningListRow";
import { InterestSelectBottomSheet } from "@features/google-form-conversion/components/InterestSelectBottomSheet";
import { RespondentCountSelectBottomSheet } from "@features/google-form-conversion/components/RespondentCountSelectBottomSheet";
import { useGoogleFormConversion } from "@features/google-form-conversion/context/GoogleFormConversionContext";
import { pickValidationSuccessForFormLink } from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import { validateDiscountCode } from "@features/google-form-conversion/service/api";
import type {
	FormValues,
	QuestionPackage,
} from "@features/google-form-conversion/types";
import { RESPONDENT_OPTIONS } from "@features/google-form-conversion/types";
import {
	formatDateToISO,
	formatInterestSelectionDisplay,
	formatPrice,
	getDefaultDeadline,
	getQuestionRange,
	getTotalQuestionCountForPricing,
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { AgeMultiSelectBottomSheet } from "@features/payment/components/payment/bottomSheet/AgeMultiSelectBottomSheet";
import {
	AGE,
	formatAgeDisplay,
	getGenderLabel,
} from "@features/payment/constants/payment";
import { topics } from "@shared/constants/topics";
import type { Estimate } from "@shared/contexts/PaymentContext";
import {
	lookupEstimatePromoTablePrice,
	lookupEstimateTablePrice,
} from "@shared/lib/estimatePricingTable";
import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	Button,
	FixedBottomCTA,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionOptionsPage = () => {
	const navigate = useNavigate();
	const {
		formLink: formLinkFromContext,
		email: emailFromContext,
		validationResult,
		screening,
	} = useGoogleFormConversion();

	const formLinkFromState = formLinkFromContext?.trim() ?? "";
	const emailFromState = emailFromContext ?? "";
	const isValidEntry =
		!!formLinkFromState &&
		isGoogleFormLinkUrl(formLinkFromState) &&
		isGoogleFormConversionContactEmail(emailFromState);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
		}
	}, [isValidEntry, navigate]);

	const [promotionCodeError, setPromotionCodeError] = useState<string | null>(
		null,
	);
	const [promotionVerifyMessage, setPromotionVerifyMessage] = useState<
		string | null
	>(null);
	const [isPromotionVerifying, setIsPromotionVerifying] = useState(false);
	/** 인증하기로 검증에 성공한 코드(trim). 입력이 바뀌면 null로 리셋 */
	const [verifiedPromotionCode, setVerifiedPromotionCode] = useState<
		string | null
	>(null);
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
	/** 가격 구간용 문항 수 — 검증 API 성공 행 (`totalCount`·`convertible` 등 보정, preview API 없음) */
	const formQuestionCount = useMemo(() => {
		if (!validationResult) return null;
		const trimmed = formLink.trim();
		if (!trimmed) return null;
		const success = pickValidationSuccessForFormLink(validationResult, trimmed);
		if (!success) return null;
		return getTotalQuestionCountForPricing(success);
	}, [validationResult, formLink]);

	const respondentCount = watch("respondentCount");
	const interestIds = watch("interestIds");
	const promotionCodeInput = watch("promotionCode");
	const gender = watch("gender");
	const ages = watch("ages");

	/** 인증하기로 검증된 코드가 현재 입력과 같으면 프로모션 가격표 적용 */
	const isPromoPriceApplied =
		verifiedPromotionCode !== null &&
		verifiedPromotionCode === promotionCodeInput?.trim();

	const price = useMemo(() => {
		const questionRange = getQuestionRange(formQuestionCount);
		const questionCount = questionRange === "1_30" ? "1~30" : "31~50";

		const estimate: Estimate = {
			date: null,
			location: "ALL",
			desiredParticipants: String(respondentCount),
			questionCount,
			gender,
			ages,
		};

		return isPromoPriceApplied
			? lookupEstimatePromoTablePrice(estimate)
			: lookupEstimateTablePrice(estimate);
	}, [respondentCount, formQuestionCount, gender, ages, isPromoPriceApplied]);

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
				setVerifiedPromotionCode(code);
			} else {
				setPromotionCodeError("유효하지 않은 프로모션 코드예요");
				setVerifiedPromotionCode(null);
			}
		} catch {
			setPromotionCodeError("인증에 실패했어요. 다시 시도해주세요");
			setVerifiedPromotionCode(null);
		} finally {
			setIsPromotionVerifying(false);
		}
	}, [getValues]);

	const handleNavigateToPreview = useCallback(() => {
		if (!validationResult) return;
		navigate("/payment/google-form-conversion-preview");
	}, [navigate, validationResult]);

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
						const questionCount = questionRange === "1_30" ? "1~30" : "31~50";

						const promoEstimate: Estimate = {
							date: null,
							location: "ALL",
							desiredParticipants: String(data.respondentCount),
							questionCount,
							gender: data.gender,
							ages: data.ages,
						};

						const promoPrice = lookupEstimatePromoTablePrice(promoEstimate);
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
								...(screening && { screening }),
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
					...(screening && { screening }),
				},
			});
		},
		[navigate, price, formQuestionCount, screening],
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
				subtitleBottom={<Top.SubtitleParagraph size={15} />}
				lower={
					validationResult ? (
						<Top.LowerButton
							color="dark"
							size="small"
							variant="weak"
							display="inline"
							onClick={handleNavigateToPreview}
						>
							설문 미리보기
						</Top.LowerButton>
					) : undefined
				}
				lowerGap={0}
			/>

			<div className="flex flex-col gap-4 px-2 pt-4">
				<GoogleFormConversionScreeningListRow
					flowState={{
						formLink: formLinkFromState,
						email: emailFromState,
						screening: screening ?? undefined,
					}}
				/>
				<Border variant="height16" />
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
										const next = e.target.value;
										onChange(next);
										setPromotionCodeError(null);
										setPromotionVerifyMessage(null);
										if (next.trim() !== verifiedPromotionCode) {
											setVerifiedPromotionCode(null);
										}
									}}
									onBlur={onBlur}
								/>
							</div>
							<Button
								type="button"
								size="medium"
								variant="weak"
								loading={isPromotionVerifying}
								disabled={
									isPromotionVerifying ||
									!promotionCodeInput?.trim() ||
									(verifiedPromotionCode !== null &&
										verifiedPromotionCode === promotionCodeInput?.trim())
								}
								className="shrink-0"
								onClick={() => void handleVerifyPromotion()}
							>
								인증하기
							</Button>
						</div>
					)}
				/>
			</div>

			<RespondentCountSelectBottomSheet
				open={isRespondentSheetOpen}
				onClose={() => setIsRespondentSheetOpen(false)}
				value={respondentCount}
				onConfirm={(v) => setValue("respondentCount", v)}
			/>

			<GenderSelectBottomSheet
				open={isGenderSheetOpen}
				onClose={() => setIsGenderSheetOpen(false)}
				value={gender}
				onConfirm={(v) => setValue("gender", v)}
			/>

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
