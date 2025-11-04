import { adaptive } from "@toss/tds-colors";
import { BottomSheet, ListRow } from "@toss/tds-mobile";

interface CreateMultiChoiceBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
}

export const CreateMultiChoiceBottomSheet = ({
	isOpen,
	handleClose,
}: CreateMultiChoiceBottomSheetProps) => {
	return (
		<BottomSheet
			header={<BottomSheet.Header>어떤 항목을 추가할까요?</BottomSheet.Header>}
			open={isOpen}
			onClose={handleClose}
			cta={[]}
		>
			<ListRow
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="새 보기"
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
						top="기타 (직접 입력)"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				verticalPadding="large"
				arrowType="right"
			/>
		</BottomSheet>
	);
};
