import { adaptive } from "@toss/tds-colors";
import { BottomSheet, ListRow } from "@toss/tds-mobile";

interface QuestionTitleEditBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
}
function QuestionTitleEditBottomSheet({
	isOpen,
	handleClose,
}: QuestionTitleEditBottomSheetProps) {
	return (
		<BottomSheet
			header={<BottomSheet.Header>어떤 것을 수정할까요?</BottomSheet.Header>}
			open={isOpen}
			onClose={handleClose}
			cta={[]}
		>
			<ListRow
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="문항 제목"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				verticalPadding="large"
				arrowType="right"
			/>
			<ListRow
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="문항 상세 설명"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				verticalPadding="large"
				arrowType="right"
			/>
		</BottomSheet>
	);
}

export default QuestionTitleEditBottomSheet;
