import { BottomSheet, Checkbox, List, ListRow } from "@toss/tds-mobile";
import { AGE } from "../../constants/payment";
import { usePaymentEstimate } from "../../contexts/PaymentContext";

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
		estimate.age === "전체" ? [] : estimate.age.split(", ").filter(Boolean);

	const handleAgeToggle = (ageValue: string) => {
		if (ageValue === "전체") {
			// "전체" 선택 시 다른 모든 선택 해제
			handleEstimateChange({ ...estimate, age: "전체" });
		} else {
			// "전체"가 선택된 상태에서 다른 연령대를 선택하면 "전체" 해제
			const currentAges = estimate.age === "전체" ? [] : selectedAges;
			const newSelectedAges = currentAges.includes(ageValue)
				? currentAges.filter((age) => age !== ageValue)
				: [...currentAges, ageValue];

			handleEstimateChange({
				...estimate,
				age: newSelectedAges.length === 0 ? "전체" : newSelectedAges.join(", "),
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
							option.value === "전체"
								? estimate.age === "전체"
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
		</BottomSheet>
	);
};
