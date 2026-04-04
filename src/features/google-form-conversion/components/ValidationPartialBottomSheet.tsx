import { getQuestionNumberLabelForValidationDetail } from "@features/google-form-conversion/lib/getQuestionNumberLabelForValidationDetail";
import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";
import { adaptive } from "@toss/tds-colors";
import { BottomSheet, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

const GOOGLE_FORM_CONVERSION_PREVIEW_PATH =
	"/payment/google-form-conversion-preview";

type ValidationPartialBottomSheetProps = {
	open: boolean;
	unsupportedDetails: FormRequestValidationDetail[];
	onClose: () => void;
};

export const ValidationPartialBottomSheet = ({
	open,
	unsupportedDetails,
	onClose,
}: ValidationPartialBottomSheetProps) => {
	const navigate = useNavigate();
	const unsupportedCount = unsupportedDetails.length;

	const handleGoPreview = () => {
		onClose();
		navigate(GOOGLE_FORM_CONVERSION_PREVIEW_PATH);
	};

	return (
		<BottomSheet
			header={
				<BottomSheet.Header>
					{unsupportedCount > 0
						? `변환이 안 된 문항이 ${unsupportedCount}개 있어요`
						: "변환이 안 된 문항이 있어요"}
				</BottomSheet.Header>
			}
			headerDescription={
				<BottomSheet.HeaderDescription>
					자세한 사항은 이메일을 확인해주세요
				</BottomSheet.HeaderDescription>
			}
			open={open}
			onClose={onClose}
			cta={
				<BottomSheet.CTA
					color="primary"
					variant="fill"
					disabled={false}
					onClick={handleGoPreview}
				>
					설문 확인하기
				</BottomSheet.CTA>
			}
		>
			<div className="flex flex-col gap-3">
				<ul className="m-0 flex list-none flex-col gap-3 p-0 px-4">
					{unsupportedDetails.map((detail, index) => (
						<li
							key={`${detail.type}-${index}-${detail.title}-${detail.reason}`}
							className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white px-4 py-3"
						>
							<Text
								display="block"
								color={adaptive.grey600}
								typography="t7"
								fontWeight="medium"
							>
								{getQuestionNumberLabelForValidationDetail(detail, index)}
							</Text>
							<div className="h-1.5" />
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="bold"
							>
								{detail.title?.trim() ? detail.title : "(제목 없음)"}
							</Text>
							<div className="h-2" />
							<Text
								display="block"
								color={adaptive.red500}
								typography="t6"
								fontWeight="regular"
								className="min-w-0"
							>
								{detail.reason}
							</Text>
						</li>
					))}
				</ul>
			</div>
		</BottomSheet>
	);
};
