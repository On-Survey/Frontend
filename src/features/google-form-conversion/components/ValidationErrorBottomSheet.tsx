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
			header={
				<BottomSheet.Header>문항 변환 중 문제가 생겼어요</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					아래 내용을 확인해 주세요.
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
					다시 입력하기
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
