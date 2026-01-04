import { Storage } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	ConfirmDialog,
	FixedBottomCTA,
	TextField,
} from "@toss/tds-mobile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	DateSelectBottomSheet,
	PaymentBottomSheet,
} from "../../components/payment";
import { AgeMultiSelectBottomSheet } from "../../components/payment/bottomSheet/AgeMultiSelectBottomSheet";
import { CoinAlertBottomSheet } from "../../components/payment/bottomSheet/CoinAlertBottomSheet";
import {
	AGE,
	type AgeCode,
	DESIRED_PARTICIPANTS,
	EstimateField,
	formatAgeDisplay,
	GENDER,
	getGenderLabel,
	getRegionLabel,
} from "../../constants/payment";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useUserInfo } from "../../contexts/UserContext";
import { useModal } from "../../hooks/UseToggle";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import { pushGtmEvent } from "../../utils/gtm";
import {
	calculatePriceBreakdown,
	calculateTotalPrice,
	formatPriceAsCoin,
} from "../../utils/paymentCalculator";
import { useCreateForm } from "../QuestionForm/hooks/useSurveyMutation";

export const EstimatePage = () => {
	const {
		estimate,
		handleEstimateChange,
		handleTotalPriceChange,
		resetEstimate,
	} = usePaymentEstimate();
	const { state, resetForm } = useSurvey();
	const { setSurveyStep, setPaymentStep } = useMultiStep();
	const location = useLocation();
	const navigate = useNavigate();
	const createFormMutation = useCreateForm();
	const hasSentEvent = useRef(false);

	const { userInfo } = useUserInfo();

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	const {
		isOpen: isBottomSheetOpen,
		handleOpen: handleBottomSheetOpen,
		handleClose: handleBottomSheetClose,
	} = useModal(false);

	const {
		isOpen: isAgeBottomSheetOpen,
		handleOpen: handleAgeBottomSheetOpen,
		handleClose: handleAgeBottomSheetClose,
	} = useModal(false);

	const {
		isOpen: isCoinBottomSheetOpen,
		handleOpen: handleCoinBottomSheetOpen,
		handleClose: handleCoinBottomSheetClose,
	} = useModal(false);

	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleSubmit = () => {
		handleConfirmDialogClose();

		const source = locationState?.source ?? "main_cta";
		const respondentTarget = estimate.desiredParticipants;
		const ageGroup = estimate.ages.length > 0 ? estimate.ages.join(",") : "";
		const gender =
			estimate.gender === "MALE"
				? "male"
				: estimate.gender === "FEMALE"
					? "female"
					: "";
		const region = estimate.location ? "true" : "false";
		const priceCoin = totalPrice;

		pushGtmEvent({
			event: "survey_settlement",
			pagePath: "/createForm",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			step: "confirm",
			respondent_target: respondentTarget,
			...(ageGroup && { age_group: ageGroup }),
			...(gender && { gender }),
			region,
			price_coin: priceCoin,
			source,
		});

		if (userInfo && totalPrice > userInfo?.result.coin) {
			// 코인이 부족하면 코인 모달 표시
			handleCoinBottomSheetOpen();
		} else {
			// 코인이 충분하면 폼 생성
			if (formPayload && !createFormMutation.isPending) {
				createFormMutation.mutate(formPayload, {
					onSuccess: handleSuccess,
					onError: (error) => {
						console.error("폼 생성 실패:", error);
					},
				});
			}
		}
	};

	const handleDateBottomSheetConfirm = (date: Date) => {
		handleEstimateChange({ ...estimate, date });
	};

	const [type, setType] = useState<EstimateField>(
		EstimateField.DesiredParticipants,
	);

	const handleTypeChange = (type: EstimateField) => {
		setType(type);
		handleBottomSheetOpen();
	};

	const totalPrice = useMemo(() => {
		return calculateTotalPrice(estimate);
	}, [estimate]);

	useEffect(() => {
		handleTotalPriceChange(totalPrice);
	}, [totalPrice, handleTotalPriceChange]);

	useEffect(() => {
		if (hasSentEvent.current) return;

		hasSentEvent.current = true;
		const source = locationState?.source ?? "main_cta";
		const entryType = state.screening.enabled
			? "screening_complete"
			: "screening_skip";

		pushGtmEvent({
			event: "survey_settlement",
			pagePath: "/createForm",
			step: "view",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			source,
			entry_type: entryType,
		});
	}, [locationState?.source, state.surveyId, state.screening.enabled]);

	const priceBreakdown = useMemo(
		() => calculatePriceBreakdown(estimate),
		[estimate],
	);

	const formPayload = useMemo(() => {
		if (!state.surveyId) return null;
		return {
			surveyId: state.surveyId,
			deadline: estimate.date?.toISOString() ?? "",
			gender: estimate.gender,
			genderPrice: priceBreakdown.genderPrice,
			ages: estimate.ages,
			agePrice: priceBreakdown.agePrice,
			residence: estimate.location,
			residencePrice: priceBreakdown.residencePrice,
			dueCount: priceBreakdown.dueCount,
			dueCountPrice: priceBreakdown.dueCountPrice,
			totalCoin: priceBreakdown.totalPrice,
		};
	}, [
		state.surveyId,
		estimate.date,
		estimate.gender,
		estimate.ages,
		estimate.location,
		priceBreakdown,
	]);

	const handleSuccess = useCallback(() => {
		resetForm();
		resetEstimate();
		setPaymentStep(3); // PaymentLoading으로 이동
	}, [resetForm, resetEstimate, setPaymentStep]);

	const genderDisplay = getGenderLabel(estimate.gender);
	const ageDisplay = formatAgeDisplay(estimate.ages);
	const locationDisplay = getRegionLabel(estimate.location);

	const handleReturn = () => {
		switch (type) {
			case EstimateField.Gender:
				return {
					value: estimate.gender,
					title: "대상 성별을 설정해주세요",
					options: GENDER,
					field: EstimateField.Gender,
				};
			case EstimateField.DesiredParticipants:
				return {
					value: estimate.desiredParticipants,
					title: "원하는 응답자 수를 선택해주세요",
					options: DESIRED_PARTICIPANTS,
					field: EstimateField.DesiredParticipants,
				};
			default:
				return { value: "", title: "", options: [], field: EstimateField.Age };
		}
	};

	const handleAgeBottomSheetConfirm = (ages: AgeCode[]) => {
		handleEstimateChange({ ...estimate, ages });
	};

	useBackEventListener(() => setSurveyStep(3));

	return (
		<>
			<ConfirmDialog
				open={isConfirmDialogOpen}
				title={`정말  ${formatPriceAsCoin(totalPrice)}을 결제할까요`}
				description={`즉시 보유 코인에서 ${formatPriceAsCoin(totalPrice)}이 차감되며, 설문은 바로 노출되기 시작해요`}
				cancelButton={
					<ConfirmDialog.CancelButton
						size="xlarge"
						onClick={handleConfirmDialogClose}
					>
						닫기
					</ConfirmDialog.CancelButton>
				}
				confirmButton={
					<ConfirmDialog.ConfirmButton size="xlarge" onClick={handleSubmit}>
						결제하기
					</ConfirmDialog.ConfirmButton>
				}
			/>
			<CoinAlertBottomSheet
				isOpen={isCoinBottomSheetOpen}
				handleClose={handleCoinBottomSheetClose}
			/>
			<AgeMultiSelectBottomSheet
				isOpen={isAgeBottomSheetOpen}
				handleClose={handleAgeBottomSheetClose}
				options={AGE}
				value={estimate.ages}
				onConfirm={(ages: AgeCode[]) => handleAgeBottomSheetConfirm(ages)}
				title="대상 연령대를 선택해주세요"
			/>
			<PaymentBottomSheet
				isOpen={isBottomSheetOpen}
				handleClose={handleBottomSheetClose}
				options={handleReturn().options ?? []}
				value={handleReturn().value}
				title={handleReturn().title}
				field={handleReturn().field}
			/>
			<TextField.Button
				variant="line"
				hasError={false}
				label="희망 응답자 수"
				value={estimate.desiredParticipants}
				placeholder="희망 응답자 수"
				right={
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						name="icon-arrow-down-mono"
						color={adaptive.grey400}
						aria-hidden={true}
					/>
				}
				onClick={() => handleTypeChange(EstimateField.DesiredParticipants)}
			/>
			<TextField.Button
				variant="line"
				hasError={false}
				label="성별"
				labelOption="sustain"
				value={genderDisplay}
				placeholder="성별을 선택해주세요"
				right={
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						name="icon-arrow-down-mono"
						color={adaptive.grey400}
						aria-hidden={true}
					/>
				}
				onClick={() => handleTypeChange(EstimateField.Gender)}
			/>
			<TextField.Button
				variant="line"
				hasError={false}
				label="연령대"
				labelOption="sustain"
				value={ageDisplay}
				placeholder="연령대를 선택해주세요"
				right={
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						name="icon-arrow-down-mono"
						color={adaptive.grey400}
						aria-hidden={true}
					/>
				}
				onClick={() => handleAgeBottomSheetOpen()}
			/>
			<TextField.Button
				variant="line"
				hasError={false}
				label="거주지"
				labelOption="sustain"
				value={locationDisplay}
				placeholder="거주지를 선택해주세요"
				help="현재 준비 중이에요"
				disabled={true}
				right={
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						name="icon-arrow-down-mono"
						color={adaptive.grey400}
						aria-hidden={true}
					/>
				}
				onClick={() => {
					Storage.setItem("createFormReturnStep", "4");
					navigate("/payment/location");
				}}
			/>
			<DateSelectBottomSheet
				value={estimate.date ?? new Date()}
				onChange={handleDateBottomSheetConfirm}
			/>
			<FixedBottomCTA loading={false} onClick={handleConfirmDialogOpen}>
				{formatPriceAsCoin(totalPrice)} 결제하기
			</FixedBottomCTA>
		</>
	);
};
