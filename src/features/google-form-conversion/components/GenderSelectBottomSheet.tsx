import { GENDER, type GenderCode } from "@features/payment/constants/payment";
import { BottomSheet } from "@toss/tds-mobile";
import type { ChangeEvent, CSSProperties } from "react";
import { useEffect, useState } from "react";

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
	const [draft, setDraft] = useState<GenderCode>(value);

	useEffect(() => {
		if (open) {
			setDraft(value);
		}
	}, [open, value]);

	const handleConfirm = () => {
		onConfirm(draft);
		onClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>대상 성별을 설정해주세요</BottomSheet.Header>}
			open={open}
			onClose={onClose}
			maxHeight="90vh"
			cta={
				<BottomSheet.CTA
					loading={false}
					onClick={handleConfirm}
					style={{ "--button-background-color": "#15c67f" } as CSSProperties}
				>
					확인
				</BottomSheet.CTA>
			}
		>
			<div className="mb-4">
				<BottomSheet.Select
					value={draft}
					options={GENDER.map((option) => ({
						name: option.name,
						value: option.value,
						hideUnCheckedCheckBox: option.value !== draft,
					}))}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setDraft(e.target.value as GenderCode);
					}}
				/>
			</div>
		</BottomSheet>
	);
};
