import { GENDER, type GenderCode } from "@features/payment/constants/payment";
import { BottomSheet } from "@toss/tds-mobile";
import type { ChangeEvent } from "react";

type GenderSelectBottomSheetProps = {
	open: boolean;
	onClose: () => void;
	value: GenderCode;
	onConfirm: (value: GenderCode) => void;
};

export const GenderSelectBottomSheet = ({
	open,
	onClose,
	value,
	onConfirm,
}: GenderSelectBottomSheetProps) => {
	return (
		<BottomSheet
			header={<BottomSheet.Header>대상 성별을 설정해주세요</BottomSheet.Header>}
			open={open}
			onClose={onClose}
			maxHeight="90vh"
		>
			<div className="mb-4">
				<BottomSheet.Select
					value={value}
					options={GENDER.map((option) => ({
						name: option.name,
						value: option.value,
						hideUnCheckedCheckBox: option.value !== value,
					}))}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						onConfirm(e.target.value as GenderCode);
						onClose();
					}}
				/>
			</div>
		</BottomSheet>
	);
};
