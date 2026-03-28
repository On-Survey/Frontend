import type { RespondentCount } from "@features/google-form-conversion/types";
import { RESPONDENT_OPTIONS } from "@features/google-form-conversion/types";
import { BottomSheet } from "@toss/tds-mobile";
import type { ChangeEvent, CSSProperties } from "react";
import { useEffect, useState } from "react";

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
	const [draft, setDraft] = useState<RespondentCount>(value);

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
			header={
				<BottomSheet.Header>희망 응답자 수를 선택해주세요</BottomSheet.Header>
			}
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
			<div>
				<BottomSheet.Select
					value={String(draft)}
					options={RESPONDENT_OPTIONS.map((option) => ({
						name: option.label,
						value: String(option.value),
						hideUnCheckedCheckBox: option.value !== draft,
					}))}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setDraft(Number(e.target.value) as RespondentCount);
					}}
				/>
			</div>
		</BottomSheet>
	);
};
