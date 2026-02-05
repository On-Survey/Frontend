import { usePaymentEstimate } from "@shared/contexts/PaymentContext";
import { BottomSheet, Checkbox, List, ListRow } from "@toss/tds-mobile";
import { AGE, type AgeCode } from "../../constants/payment";

interface AgeSelectBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
}

export const AgeSelectBottomSheet = ({
	isOpen,
	handleClose,
}: AgeSelectBottomSheetProps) => {
	const { estimate, handleEstimateChange } = usePaymentEstimate();

	// 연령대 복수 선택 처리
	const selectedAges =
		estimate.ages.length === 1 && estimate.ages[0] === "ALL"
			? []
			: estimate.ages.filter((age) => age !== "ALL");

	const handleAgeToggle = (ageValue: AgeCode) => {
		if (ageValue === "ALL") {
			// "전체" 선택 시 다른 모든 선택 해제
			handleEstimateChange({ ...estimate, ages: ["ALL"] });
		} else {
			// "전체"가 선택된 상태에서 다른 연령대를 선택하면 "전체" 해제
			const currentAges =
				estimate.ages.length === 1 && estimate.ages[0] === "ALL"
					? []
					: selectedAges;
			const newSelectedAges = currentAges.includes(ageValue)
				? currentAges.filter((age) => age !== ageValue)
				: [...currentAges, ageValue];

			handleEstimateChange({
				...estimate,
				ages: newSelectedAges.length === 0 ? ["ALL"] : newSelectedAges,
			});
		}
	};

	return (
		<BottomSheet
			header={
				<BottomSheet.Header>대상 연령대를 선택해주세요</BottomSheet.Header>
			}
			open={isOpen}
			onClose={handleClose}
			cta={[]}
		>
			<div className="flex-1 overflow-y-auto">
				<List>
					{AGE.map((option) => {
						const isSelected =
							option.value === "ALL"
								? estimate.ages.length === 1 && estimate.ages[0] === "ALL"
								: selectedAges.includes(option.value);

						return (
							<ListRow
								key={option.value}
								role="checkbox"
								aria-checked={isSelected}
								onClick={() => handleAgeToggle(option.value)}
								contents={<ListRow.Texts type="1RowTypeA" top={option.name} />}
								right={
									<Checkbox.Line
										checked={isSelected}
										size={20}
										aria-hidden={true}
										style={{ pointerEvents: "none" }}
									/>
								}
							/>
						);
					})}
				</List>
			</div>
			<BottomSheet.CTA
				loading={false}
				onClick={handleClose}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				확인
			</BottomSheet.CTA>
		</BottomSheet>
	);
};
