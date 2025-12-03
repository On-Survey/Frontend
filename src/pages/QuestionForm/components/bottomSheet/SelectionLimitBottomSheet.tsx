import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useSurvey } from "../../../../contexts/SurveyContext";

interface SelectionLimitBottomSheetProps {
	questionId: string;
	isOpen: boolean;
	handleClose: () => void;
	maxOptionsCount: number;
}

export const SelectionLimitBottomSheet = ({
	questionId,
	isOpen,
	handleClose,
	maxOptionsCount,
}: SelectionLimitBottomSheetProps) => {
	const { updateQuestion } = useSurvey();

	const [selectionLimit, setSelectionLimit] = useState(1);

	const handleSelectionLimitChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = Number(e.target.value);
		// 최대 선지 개수를 초과하지 않도록 제한
		if (value <= maxOptionsCount) {
			setSelectionLimit(value);
		}
	};

	const handleConfirm = () => {
		updateQuestion(questionId, {
			maxChoice: selectionLimit,
		});
		handleClose();
	};

	const isError = selectionLimit > maxOptionsCount;

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
					disabled={selectionLimit <= 0 || isError}
					onClick={handleConfirm}
				>
					확인
				</BottomSheet.CTA>
			}
			ctaContentGap={0}
		>
			<TextField.Clearable
				variant="line"
				hasError={isError}
				label=""
				labelOption="sustain"
				value={selectionLimit.toString()}
				placeholder="숫자만 입력해주세요"
				help={
					isError
						? `선택 가능한 개수는 옵션 개수(${maxOptionsCount}개)를 초과할 수 없어요`
						: `최대 ${maxOptionsCount}개까지 선택할 수 있어요`
				}
				autoFocus={true}
				type="numeric"
				onChange={handleSelectionLimitChange}
			/>
		</BottomSheet>
	);
};
