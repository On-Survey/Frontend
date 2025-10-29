import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useSurvey } from "../../../contexts/SurveyContext";

interface SelectionLimitBottomSheetProps {
	questionId: string;
	isOpen: boolean;
	handleClose: () => void;
}

function SelectionLimitBottomSheet({
	questionId,
	isOpen,
	handleClose,
}: SelectionLimitBottomSheetProps) {
	const { updateQuestion } = useSurvey();

	const [selectionLimit, setSelectionLimit] = useState(1);

	const handleSelectionLimitChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSelectionLimit(Number(e.target.value));
	};

	const handleConfirm = () => {
		updateQuestion(questionId, {
			allowSelection: selectionLimit,
		});
		handleClose();
	};

	return (
		<BottomSheet
			header={
				<BottomSheet.Header>선택 가능한 개수를 입력해주세요</BottomSheet.Header>
			}
			open={isOpen}
			onClose={handleClose}
			hasTextField={true}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={selectionLimit <= 0}
					onClick={handleConfirm}
				>
					확인
				</BottomSheet.CTA>
			}
			ctaContentGap={0}
		>
			<TextField.Clearable
				variant="line"
				hasError={false}
				label=""
				labelOption="sustain"
				value={selectionLimit.toString()}
				placeholder="숫자만 입력해주세요"
				autoFocus={true}
				type="numeric"
				onChange={handleSelectionLimitChange}
			/>
		</BottomSheet>
	);
}

export default SelectionLimitBottomSheet;
