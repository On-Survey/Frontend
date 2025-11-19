import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, TextField, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	AgeSelectBottomSheet,
	EstimateDetailBottomSheet,
} from "../../components/estimate";
import { PaymentBottomSheet } from "../../components/payment";
import {
	DESIRED_PARTICIPANTS,
	EstimateField,
	formatAgeDisplay,
	GENDER,
	getGenderLabel,
	getRegionLabel,
	type RegionCode,
} from "../../constants/payment";
import { usePaymentEstimate } from "../../contexts/PaymentContext";
import { useModal } from "../../hooks/UseToggle";
import { calculateTotalPrice, formatPrice } from "../../utils/estimatePrice";

const { frameShape: assetFrameShape } = Asset;

const EstimatePageContent = () => {
	const navigate = useNavigate();
	const { estimate, handleEstimateChange } = usePaymentEstimate();
	const [type, setType] = useState<EstimateField>(
		EstimateField.DesiredParticipants,
	);

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
		isOpen: isDetailBottomSheetOpen,
		handleOpen: handleDetailBottomSheetOpen,
		handleClose: handleDetailBottomSheetClose,
	} = useModal(false);

	useEffect(() => {
		if (!estimate.desiredParticipants) {
			handleEstimateChange({
				...estimate,
				desiredParticipants: "50",
				gender: "ALL",
				age: ["ALL"],
				location: "ALL",
			});
		}
	}, [estimate, handleEstimateChange]);

	const handleTypeChange = (fieldType: EstimateField) => {
		if (fieldType === EstimateField.Age) {
			handleAgeBottomSheetOpen();
		} else {
			setType(fieldType);
			handleBottomSheetOpen();
		}
	};

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
				return {
					value: "",
					title: "",
					options: [],
					field: EstimateField.Gender,
				};
		}
	};

	return (
		<>
			<PaymentBottomSheet
				isOpen={isBottomSheetOpen}
				handleClose={handleBottomSheetClose}
				options={handleReturn().options ?? []}
				value={handleReturn().value}
				title={handleReturn().title}
				field={handleReturn().field}
			/>

			<AgeSelectBottomSheet
				isOpen={isAgeBottomSheetOpen}
				handleClose={handleAgeBottomSheetClose}
			/>

			<EstimateDetailBottomSheet
				isOpen={isDetailBottomSheetOpen}
				handleClose={handleDetailBottomSheetClose}
				estimate={estimate}
			/>

			<div className="flex flex-col w-full min-h-screen bg-white">
				<Top
					title={
						<Top.TitleParagraph size={22} color={adaptive.grey900}>
							설정에 따라 가격이 달라질 수 있어요
						</Top.TitleParagraph>
					}
					subtitleTop={
						<Top.SubtitleParagraph color={adaptive.blue500}>
							견적 계산기
						</Top.SubtitleParagraph>
					}
				/>

				<div className="flex-1 px-2">
					<TextField.Button
						variant="line"
						hasError={false}
						label="희망 응답자 수"
						labelOption="sustain"
						value={estimate.desiredParticipants}
						placeholder="희망 응답자 수를 선택해주세요"
						right={
							<Asset.Icon
								frameShape={assetFrameShape.CleanW24}
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
						help="특정 성별만 선택하면 추가 비용이 발생해요"
						value={getGenderLabel(estimate.gender)}
						placeholder="전체"
						right={
							<Asset.Icon
								frameShape={assetFrameShape.CleanW24}
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
						help="복수 선택 시 추가 요금이 부과되고, 전체 선택 시는 제외돼요."
						value={formatAgeDisplay(estimate.age)}
						placeholder="연령대를 선택해주세요"
						right={
							<Asset.Icon
								frameShape={assetFrameShape.CleanW24}
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
						label="거주지"
						labelOption="sustain"
						value={getRegionLabel(estimate.location as RegionCode)}
						placeholder="거주지를 선택해주세요"
						right={
							<Asset.Icon
								frameShape={assetFrameShape.CleanW24}
								name="icon-arrow-down-mono"
								color={adaptive.grey400}
								aria-hidden={true}
							/>
						}
						onClick={() => {
							navigate("/estimate/location");
						}}
					/>
				</div>

				<FixedBottomCTA loading={false} onClick={handleDetailBottomSheetOpen}>
					{formatPrice(calculateTotalPrice(estimate))} 상세 내역 보기
				</FixedBottomCTA>
			</div>
		</>
	);
};

export const EstimatePage = () => {
	return <EstimatePageContent />;
};

export default EstimatePage;
