import { graniteEvent, Storage } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, TextField } from "@toss/tds-mobile";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useModal } from "../../hooks/UseToggle";
import { type createUserResponse, getUserInfo } from "../../service/user";
import {
	calculateTotalPrice,
	formatPriceAsCoin,
} from "../../utils/paymentCalculator";

export const EstimatePage = () => {
	const { estimate, handleEstimateChange, handleTotalPriceChange } =
		usePaymentEstimate();
	const { handleStepChange, setPaymentStep } = useMultiStep();
	const navigate = useNavigate();

	const [userInfo, setUserInfo] = useState<createUserResponse | null>(null);

	useEffect(() => {
		async function fetchUserInfo() {
			const userInfoResult = await getUserInfo();
			setUserInfo(userInfoResult);
		}
		fetchUserInfo();
	}, []);

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

	const handleSubmit = () => {
		if (userInfo && totalPrice > userInfo?.result.coin) {
			handleCoinBottomSheetOpen();
		} else {
			setPaymentStep(3);
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

	const genderDisplay = getGenderLabel(estimate.gender);
	const ageDisplay = formatAgeDisplay(estimate.age);
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

	const handleAgeBottomSheetConfirm = (age: AgeCode[]) => {
		handleEstimateChange({ ...estimate, age });
	};

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				handleStepChange(3);
			},
			onError: (error) => {
				alert(`에러가 발생했어요: ${error}`);
			},
		});

		return unsubscription;
	}, [handleStepChange]);

	return (
		<>
			<CoinAlertBottomSheet
				isOpen={isCoinBottomSheetOpen}
				handleClose={handleCoinBottomSheetClose}
			/>
			<AgeMultiSelectBottomSheet
				isOpen={isAgeBottomSheetOpen}
				handleClose={handleAgeBottomSheetClose}
				options={AGE}
				value={estimate.age}
				onConfirm={(age: AgeCode[]) => handleAgeBottomSheetConfirm(age)}
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
			<FixedBottomCTA loading={false} onClick={handleSubmit}>
				{formatPriceAsCoin(totalPrice)} 결제하기
			</FixedBottomCTA>
		</>
	);
};
