import type { RespondentCount } from "@features/google-form-conversion/types";
import { RESPONDENT_OPTIONS } from "@features/google-form-conversion/types";
import { BottomSheet } from "@toss/tds-mobile";
import type { ChangeEvent } from "react";

type RespondentCountSelectBottomSheetProps = {
	open: boolean;
	onClose: () => void;
	value: RespondentCount;
	onConfirm: (value: RespondentCount) => void;
};

export const RespondentCountSelectBottomSheet = ({
	open,
	onClose,
	value,
	onConfirm,
}: RespondentCountSelectBottomSheetProps) => {
	return (
		<BottomSheet
			header={
				<BottomSheet.Header>희망 응답자 수를 선택해주세요</BottomSheet.Header>
			}
			open={open}
			onClose={onClose}
			maxHeight="90vh"
		>
			<div>
				<BottomSheet.Select
					value={String(value)}
					options={RESPONDENT_OPTIONS.map((option) => ({
						name: option.label,
						value: String(option.value),
						hideUnCheckedCheckBox: option.value !== value,
					}))}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						onConfirm(Number(e.target.value) as RespondentCount);
						onClose();
					}}
				/>
			</div>
		</BottomSheet>
	);
};
