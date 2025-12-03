import { BottomSheet, Checkbox, List, ListRow } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import type { AgeCode } from "../../../constants/payment";

type AgeOption = {
	name: string;
	value: AgeCode;
	hideUnCheckedCheckBox?: boolean;
};

interface AgeMultiSelectBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
	options: AgeOption[];
	value: AgeCode[];
	onConfirm: (value: AgeCode[]) => void;
	title: string;
}

export const AgeMultiSelectBottomSheet = ({
	isOpen,
	handleClose,
	options,
	value,
	onConfirm,
	title,
}: AgeMultiSelectBottomSheetProps) => {
	const [selectedValues, setSelectedValues] = useState<AgeCode[]>(value);

	useEffect(() => {
		if (isOpen) {
			setSelectedValues(value);
		}
	}, [isOpen, value]);

	const handleToggle = (targetValue: AgeCode) => {
		if (targetValue === "ALL") {
			setSelectedValues(["ALL"]);
		} else {
			setSelectedValues((prev) => {
				const withoutAll = prev.filter((v) => v !== "ALL");
				const exists = withoutAll.includes(targetValue);
				if (exists) {
					const newValues = withoutAll.filter((v) => v !== targetValue);
					return newValues.length === 0 ? ["ALL"] : newValues;
				} else {
					return [...withoutAll, targetValue];
				}
			});
		}
	};

	const handleConfirm = () => {
		onConfirm(selectedValues);
		handleClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>{title}</BottomSheet.Header>}
			open={isOpen}
			onClose={handleClose}
			cta={[]}
		>
			<div className="flex-1 overflow-y-auto">
				<List>
					{options.map((option) => {
						const isSelected = selectedValues.includes(option.value);

						return (
							<ListRow
								key={option.value}
								role="checkbox"
								aria-checked={isSelected}
								onClick={() => handleToggle(option.value)}
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

			<BottomSheet.CTA loading={false} onClick={handleConfirm}>
				확인
			</BottomSheet.CTA>
		</BottomSheet>
	);
};
