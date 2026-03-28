import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";
import { BottomSheet, Post } from "@toss/tds-mobile";

type GoogleFormConversionValidationPartialBottomSheetProps = {
	open: boolean;
	unsupportedDetails: FormRequestValidationDetail[];
	onClose: () => void;
	onPreview: () => void;
};

export const GoogleFormConversionValidationPartialBottomSheet = ({
	open,
	unsupportedDetails,
	onClose,
	onPreview,
}: GoogleFormConversionValidationPartialBottomSheetProps) => {
	return (
		<BottomSheet
			header={
				<BottomSheet.Header>변환이 안된 문항이 있어요</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					다음 문항을 지원하지 않아요
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={false}
					onClick={onPreview}
				>
					미리보기
				</BottomSheet.CTA>
			}
		>
			<Post.Ul>
				{unsupportedDetails.length > 0 ? (
					unsupportedDetails.flatMap((detail, index) => [
						<Post.Li
							key={`t-${index}-${detail.type}-${detail.reason}`}
						>{`미지원 문항 제목 : ${detail.title ?? "(제목 없음)"}`}</Post.Li>,
						<Post.Li
							key={`r-${index}-${detail.type}-${detail.reason}`}
						>{`미지원 사유 : ${detail.reason}`}</Post.Li>,
					])
				) : (
					<Post.Li>일부 문항은 변환이 불가능했어요</Post.Li>
				)}
				<Post.Li>미리보기에서 변환이 안된 문항을 확인하세요</Post.Li>
			</Post.Ul>
		</BottomSheet>
	);
};
