import { BottomSheet, Post } from "@toss/tds-mobile";

type ValidationErrorBottomSheetProps = {
	open: boolean;
	message: string;
	onClose: () => void;
};

export const ValidationErrorBottomSheet = ({
	open,
	message,
	onClose,
}: ValidationErrorBottomSheetProps) => {
	return (
		<BottomSheet
			header={<BottomSheet.Header>설문을 불러올 수 없어요</BottomSheet.Header>}
			headerDescription={
				<BottomSheet.HeaderDescription>
					자세한 내용은 이메일을 확인해주세요
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={false}
					onClick={onClose}
				>
					다시 등록하기
				</BottomSheet.CTA>
			}
		>
			<div style={{ height: "16px" }} />
			<Post.Ul>
				<Post.Li>{message}</Post.Li>
			</Post.Ul>
		</BottomSheet>
	);
};
