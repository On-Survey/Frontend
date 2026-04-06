import { GenderSelectBottomSheet } from "@features/google-form-conversion/components/GenderSelectBottomSheet";
import { InterestSelectBottomSheet } from "@features/google-form-conversion/components/InterestSelectBottomSheet";
import { RespondentCountSelectBottomSheet } from "@features/google-form-conversion/components/RespondentCountSelectBottomSheet";
import { ScreeningListRow } from "@features/google-form-conversion/components/ScreeningListRow";
import { useOptionsForm } from "@features/google-form-conversion/context/OptionsFormContext";
import {
	useRequestEntryContext,
	useRequestFormContext,
} from "@features/google-form-conversion/context/RequestEntryContext";
import {
	fetchNearestIapProductForTablePrice,
	parseIapDisplayAmount,
	useIapProductByPrice,
} from "@features/google-form-conversion/hooks/useIapProductByPrice";
import { pickValidationSuccessForFormLink } from "@features/google-form-conversion/lib/pickValidationPreviewForFormLink";
import { validateDiscountCode } from "@features/google-form-conversion/service/api";
import type {
	FormValues,
	OptionsFormValues,
} from "@features/google-form-conversion/types";
import { RESPONDENT_OPTIONS } from "@features/google-form-conversion/types";
import {
	formatDateToISO,
	formatInterestSelectionDisplay,
	formatPrice,
	getDefaultDeadline,
	getQuestionRange,
	getTotalQuestionCountForPricing,
	isContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { DateSelectBottomSheet } from "@features/payment/components/payment";
import { AgeMultiSelectBottomSheet } from "@features/payment/components/payment/bottomSheet/AgeMultiSelectBottomSheet";
import {
	AGE,
	formatAgeDisplay,
	getGenderLabel,
} from "@features/payment/constants/payment";
import type { Estimate } from "@shared/contexts/PaymentContext";
import { useBackEventListener } from "@shared/hooks/useBackEventListener";
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
	Text,
	TextField,
	Top,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const OptionsPage = () => {
	const navigate = useNavigate();
	const { validationResult } = useRequestEntryContext();
	const { formLink: formLinkRaw, email: emailFromState } =
		useRequestFormContext();
	const {
		control,
		watch,
		setValue,
		getValues,
		handleSubmit: rhfHandleSubmit,
	} = useOptionsForm();
	const {
		findProductByPrice,
		isLoading: isProductResolving,
		error: productResolveError,
	} = useIapProductByPrice();

	const screening = watch("screening");

	const formLinkFromState = formLinkRaw.trim() ?? "";
	const isValidEntry =
		!!formLinkFromState &&
		isGoogleFormLinkUrl(formLinkFromState) &&
		isContactEmail(emailFromState);

	useEffect(() => {
		if (!isValidEntry) {
			navigate("/payment/google-form-conversion", { replace: true });
		}
	}, [isValidEntry, navigate]);

	const [promotionCodeError, setPromotionCodeError] = useState<string | null>(
		null,
	);
	const [isPromotionVerifying, setIsPromotionVerifying] = useState(false);
	const [isRespondentSheetOpen, setIsRespondentSheetOpen] = useState(false);
	const [isGenderSheetOpen, setIsGenderSheetOpen] = useState(false);
	const [isAgeSheetOpen, setIsAgeSheetOpen] = useState(false);
	const [isInterestSheetOpen, setIsInterestSheetOpen] = useState(false);
	/** 결제 확인 페이지와 동일: IAP 상품 `displayAmount` (가격표 기준가와 다를 수 있음) */
	const [iapChargeAmount, setIapChargeAmount] = useState<number | null>(null);

	const formLink = formLinkFromState;
	/** 가격 구간용 문항 수 — 검증 API 성공 행 (`totalCount`·`convertible` 등 보정, preview API 없음) */
	const validationSuccess = useMemo(() => {
		if (!validationResult) return null;
		const trimmed = formLink.trim();
		if (!trimmed) return null;
		return pickValidationSuccessForFormLink(validationResult, trimmed);
	}, [validationResult, formLink]);

	const formQuestionCount = useMemo(() => {
		if (!validationSuccess) return null;
		return getTotalQuestionCountForPricing(validationSuccess);
	}, [validationSuccess]);
	const convertibleQuestionCount = validationSuccess?.convertible ?? 0;
	const inconvertibleQuestionCount = useMemo(() => {
		if (!validationSuccess) return 0;
		if (validationSuccess.inconvertible > 0) {
			return validationSuccess.inconvertible;
		}
		return validationSuccess.inconvertibleDetails?.length ?? 0;
	}, [validationSuccess]);
	const isFullConversionSuccess = inconvertibleQuestionCount === 0;

	const handleHeaderBack = useCallback(() => {
		if (validationSuccess && isFullConversionSuccess) {
			navigate("/payment/google-form-conversion");
			return;
		}
		navigate(-1);
	}, [validationSuccess, isFullConversionSuccess, navigate]);

	useBackEventListener(handleHeaderBack);

	const ageMultiSelectOptions = useMemo(
		() =>
			AGE.map((o) => ({
				...o,
				name: o.name.replace(/\([^)]*\)/g, "").trim(),
			})),
		[],
	);

	const respondentCount = watch("respondentCount");
	const deadlineIsoDate = watch("deadlineIsoDate");
	const interestIds = watch("interestIds");
	const promotionCodeInput = watch("promotionCode") ?? "";
	const verifiedPromotionCode = watch("verifiedPromotionCode");
	const gender = watch("gender");
	const ages = watch("ages");

	/** 인증하기로 검증된 코드가 현재 입력과 같으면 프로모션 가격표 적용 */
	const isPromoPriceApplied =
		verifiedPromotionCode !== null &&
		verifiedPromotionCode === promotionCodeInput.trim();
	const promotionVerifyMessage = isPromoPriceApplied
		? "코드가 적용되었어요"
		: null;

	const deadlineDate = useMemo(() => {
		if (!deadlineIsoDate || !/^\d{4}-\d{2}-\d{2}$/.test(deadlineIsoDate)) {
			return getDefaultDeadline();
		}
		const [y, m, d] = deadlineIsoDate.split("-").map(Number);
		return new Date(y, m - 1, d);
	}, [deadlineIsoDate]);

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

	useEffect(() => {
		if (!Number.isFinite(price) || price <= 0) {
			setIapChargeAmount(null);
			return;
		}
		let cancelled = false;
		fetchNearestIapProductForTablePrice(price)
			.then((product) => {
				if (cancelled) return;
				setIapChargeAmount(
					product ? parseIapDisplayAmount(product.displayAmount) : null,
				);
			})
			.catch(() => {
				if (!cancelled) {
					setIapChargeAmount(null);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [price]);

	const ctaDisplayPrice = iapChargeAmount ?? price;

	const handleVerifyPromotion = useCallback(async () => {
		const code = getValues("promotionCode")?.trim() ?? "";
		if (!code) {
			setPromotionCodeError("프로모션 코드를 입력해주세요");
			return;
		}
		setIsPromotionVerifying(true);
		setPromotionCodeError(null);
		try {
			const { valid } = await validateDiscountCode(code);
			if (valid) {
				setValue("verifiedPromotionCode", code);
			} else {
				setPromotionCodeError("등록된 코드가 아니에요");
				setValue("verifiedPromotionCode", null);
			}
		} catch {
			setPromotionCodeError("등록된 코드가 아니에요");
			setValue("verifiedPromotionCode", null);
		} finally {
			setIsPromotionVerifying(false);
		}
	}, [getValues, setValue]);

	const handleNavigateToPreviewBack = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const handleNavigateToPreviewPage = useCallback(() => {
		if (!validationResult) return;
		navigate("/payment/google-form-conversion-preview", {
			state: { previewFrom: "options" },
		});
	}, [navigate, validationResult]);

	const onSubmit = useCallback(
		async (optionsForm: OptionsFormValues) => {
			const { ...optionsData } = optionsForm;
			const data: FormValues = {
				formLink: formLinkFromState,
				email: emailFromState,
				promotionCode: optionsData.promotionCode,
				respondentCount: optionsData.respondentCount,
				deadlineIsoDate: optionsData.deadlineIsoDate,
				residence: optionsData.residence,
				interestIds: optionsData.interestIds,
				gender: optionsData.gender,
				ages: optionsData.ages,
			};
			pushGtmEvent({
				event: "form_payment_button_click",
				pagePath: "/payment/google-form-conversion-options",
			});
			setPromotionCodeError(null);

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
						const selectedProduct = await findProductByPrice(promoPrice);
						if (!selectedProduct?.sku) return;
						setValue("selectedProduct", selectedProduct);
						navigate("/payment/google-form-conversion-payment-confirm");
						return;
					}
				} catch {
					// noop
				}
				setPromotionCodeError("등록된 코드가 아니에요");
				return;
			}

			const selectedProduct = await findProductByPrice(price);
			if (!selectedProduct?.sku) return;
			setValue("selectedProduct", selectedProduct);
			navigate("/payment/google-form-conversion-payment-confirm");
		},
		[
			navigate,
			price,
			formQuestionCount,
			formLinkFromState,
			emailFromState,
			findProductByPrice,
			setValue,
		],
	);

	if (!isValidEntry) {
		return null;
	}

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						다 왔어요
						<br />
						원하는 응답자 조건을 설정해주세요
					</Top.TitleParagraph>
				}
				subtitleBottom={<Top.SubtitleParagraph size={15} />}
				lower={
					validationSuccess ? (
						<div
							className={`mx-6 mb-4 flex items-center justify-between gap-3 rounded-2xl p-3 ${
								isFullConversionSuccess ? "bg-[#e9f5f0]" : "bg-[#fcefef]"
							}`}
						>
							<div className="flex min-w-0 flex-1 items-center gap-2">
								{isFullConversionSuccess ? (
									<Asset.Icon
										frameShape={Asset.frameShape.CleanW24}
										backgroundColor="transparent"
										name="icon-check-circle-green"
										aria-hidden={true}
										ratio="1/1"
									/>
								) : (
									<Asset.Icon
										frameShape={Asset.frameShape.CleanW24}
										backgroundColor="transparent"
										name="icon-siren"
										aria-hidden={true}
										ratio="1/1"
									/>
								)}
								<Text
									display="block"
									color={adaptive.grey800}
									typography="t5"
									fontWeight="semibold"
									className="min-w-0"
								>
									{isFullConversionSuccess
										? `${convertibleQuestionCount}개의 문항이 변환됐어요`
										: `${inconvertibleQuestionCount}개 문항은 변환에 실패했어요`}
								</Text>
							</div>
							<Button
								size="small"
								variant="weak"
								color={isFullConversionSuccess ? undefined : "danger"}
								onClick={
									isFullConversionSuccess
										? handleNavigateToPreviewPage
										: handleNavigateToPreviewBack
								}
							>
								설문 보기
							</Button>
						</div>
					) : undefined
				}
				lowerGap={0}
			/>
			<Border variant="height16" />
			<div className="flex flex-col gap-4 px-2">
				<ScreeningListRow
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
					label="희망 응답자 수"
					labelOption="sustain"
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

				<DateSelectBottomSheet
					value={deadlineDate}
					onChange={(d) => setValue("deadlineIsoDate", formatDateToISO(d))}
					triggerLabel="설문조사 마감일"
				/>

				<TextField.Button
					variant="line"
					hasError={false}
					label="관심사"
					labelOption="sustain"
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
					label="성별"
					labelOption="sustain"
					help="성별 옵션을 설정하면 추가 요금이 부과돼요"
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
					help="연령대 옵션을 설정하면 추가 요금이 부과돼요"
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
					disabled={true}
					label="거주지"
					labelOption="sustain"
					help="준비 중이에요, 지금은 전체 지역 기준으로 안내돼요"
					value="준비 중"
					placeholder="준비 중"
					right={undefined}
				/>

				<Controller
					control={control}
					name="promotionCode"
					render={({ field: { onChange, value, onBlur } }) => (
						<div className="flex gap-2 items-center mr-6">
							<div className="min-w-0 flex-1">
								<TextField.Clearable
									variant="line"
									hasError={!!promotionCodeError}
									label="프로모션 코드"
									labelOption="sustain"
									help={promotionCodeError ?? promotionVerifyMessage ?? ""}
									value={value ?? ""}
									placeholder="프로모션 코드 입력"
									suffix=""
									prefix=""
									onChange={(e) => {
										const next = e.target.value;
										onChange(next);
										setPromotionCodeError(null);
										if (next.trim() !== verifiedPromotionCode) {
											setValue("verifiedPromotionCode", null);
										}
									}}
									onBlur={onBlur}
								/>
							</div>
							<Button
								type="button"
								size="small"
								variant="weak"
								loading={isPromotionVerifying}
								disabled={
									isPromotionVerifying ||
									!promotionCodeInput.trim() ||
									(verifiedPromotionCode !== null &&
										verifiedPromotionCode === promotionCodeInput.trim())
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
				options={ageMultiSelectOptions}
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
				loading={isProductResolving}
				onClick={rhfHandleSubmit(onSubmit)}
				bottomAccessory={productResolveError ?? undefined}
				disabled={interestIds.length === 0}
			>
				{formatPrice(ctaDisplayPrice)}원 결제하기
			</FixedBottomCTA>
		</>
	);
};
