import { Storage } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentBottomSheet } from "../../components/payment";
import {
	AGE,
	DESIRED_PARTICIPANTS,
	EstimateField,
	GENDER,
} from "../../constants/payment";
import { usePaymentEstimate } from "../../contexts/PaymentEstimateContext";

export const EstimatePage = () => {
	const { estimate } = usePaymentEstimate();

	const navigate = useNavigate();

	const [isDateBottomSheetOpen, setIsDateBottomSheetOpen] = useState(false);
	const [type, setType] = useState<EstimateField>(
		EstimateField.DesiredParticipants,
	);

	const handleDateBottomSheetClose = () => {
		setIsDateBottomSheetOpen(false);
	};

	const handleTypeChange = (type: EstimateField) => {
		setType(type);
		setIsDateBottomSheetOpen(true);
	};

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
			<PaymentBottomSheet
				isOpen={isDateBottomSheetOpen}
				handleClose={handleDateBottomSheetClose}
				options={handleReturn().options ?? []}
				value={handleReturn().value}
				title={handleReturn().title}
				field={handleReturn().field}
			/>
			<TextField.Button
				variant="line"
				hasError={false}
				label="설문조사 마감일"
				labelOption="sustain"
				help="선택일 자정에 설문이 마감돼요"
				value={estimate.date}
				placeholder="날짜를 선택해주세요"
				right={
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						name="icon-arrow-down-mono"
						color={adaptive.grey400}
						aria-hidden={true}
					/>
				}
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
				autoFocus={true}
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
			<FixedBottomCTA disabled={true} loading={false}>
				56,500원 결제하기
			</FixedBottomCTA>
		</>
	);
};
