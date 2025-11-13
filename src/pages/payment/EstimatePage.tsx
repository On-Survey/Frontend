import { Storage } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, TextField } from "@toss/tds-mobile";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	DateSelectBottomSheet,
	PaymentBottomSheet,
} from "../../components/payment";
import { CoinAlertBottomSheet } from "../../components/payment/bottomSheet/CoinAlertBottomSheet";
import {
	AGE,
	DESIRED_PARTICIPANTS,
	EstimateField,
	GENDER,
} from "../../constants/payment";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { useModal } from "../../hooks/UseToggle";
import {
	calculateTotalPrice,
	formatPriceAsCoin,
} from "../../utils/paymentCalculator";

export const EstimatePage = () => {
	const { estimate, handleEstimateChange } = usePaymentEstimate();

	const navigate = useNavigate();

	const {
		isOpen: isBottomSheetOpen,
		handleOpen: handleBottomSheetOpen,
		handleClose: handleBottomSheetClose,
	} = useModal(false);

	const {
		isOpen: isCoinBottomSheetOpen,
		handleOpen: handleCoinBottomSheetOpen,
		handleClose: handleCoinBottomSheetClose,
	} = useModal(false);

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

	const handleReturn = () => {
		switch (type) {
			case EstimateField.Age:
				return {
					value: estimate.age,
					title: "대상 연령대를 선택해주세요",
					options: AGE,
					field: EstimateField.Age,
				};
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

	return (
		<>
			<CoinAlertBottomSheet
				isOpen={isCoinBottomSheetOpen}
				handleClose={handleCoinBottomSheetClose}
			/>
			<DateSelectBottomSheet
				value={estimate.date ?? new Date()}
				onChange={handleDateBottomSheetConfirm}
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
				label="거주지"
				labelOption="sustain"
				value={estimate.location}
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
			<TextField.Button
				variant="line"
				hasError={false}
				label="연령대"
				labelOption="sustain"
				value={estimate.age}
				placeholder="연령대를 선택해주세요"
				right={
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						name="icon-arrow-down-mono"
						color={adaptive.grey400}
						aria-hidden={true}
					/>
				}
				onClick={() => handleTypeChange(EstimateField.Age)}
			/>
			<TextField.Button
				variant="line"
				hasError={false}
				label="전체"
				labelOption="sustain"
				value={estimate.gender}
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
			<FixedBottomCTA loading={false} onClick={handleCoinBottomSheetOpen}>
				{formatPriceAsCoin(totalPrice)} 결제하기
			</FixedBottomCTA>
		</>
	);
};
