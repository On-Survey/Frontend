import { getQuestionNumberLabelForValidationDetail } from "@features/google-form-conversion/lib/getQuestionNumberLabelForValidationDetail";
import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";
import { adaptive } from "@toss/tds-colors";
import { BottomSheet, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

const GOOGLE_FORM_CONVERSION_PREVIEW_PATH =
	"/payment/google-form-conversion-preview";

type GoogleFormConversionValidationPartialBottomSheetProps = {
	open: boolean;
	unsupportedDetails: FormRequestValidationDetail[];
	onClose: () => void;
};

export const GoogleFormConversionValidationPartialBottomSheet = ({
	open,
	unsupportedDetails,
	onClose,
}: GoogleFormConversionValidationPartialBottomSheetProps) => {
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
						? `변환이 안된 문항이 ${unsupportedCount}개 있어요`
						: "변환이 안된 문항이 있어요"}
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
					미리보기
				</BottomSheet.CTA>
			}
		>
			<div className="flex flex-col gap-3">
				<ul className="flex list-none flex-col gap-3 p-0 m-0 px-4">
					{unsupportedDetails.map((detail, index) => (
						<li
							key={`${detail.type}-${index}-${detail.title}-${detail.reason}`}
							className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB]"
						>
							<div className="border-b border-[#E5E8EB] bg-white px-4 py-2.5">
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
							</div>
							<div className="flex flex-col gap-2 px-4 py-3">
								<div className="flex items-start gap-2">
									<Text
										as="span"
										display="inline"
										color={adaptive.grey600}
										typography="t7"
										fontWeight="semibold"
										className="shrink-0 pt-0.5"
									>
										유형
									</Text>
									<span className="inline-flex rounded-md bg-[#EEF2F6] px-2 py-0.5">
										<Text
											as="span"
											color={adaptive.grey800}
											typography="t7"
											fontWeight="semibold"
										>
											{detail.type}
										</Text>
									</span>
								</div>
								<div className="flex items-start gap-2">
									<Text
										as="span"
										display="inline"
										color={adaptive.grey600}
										typography="t7"
										fontWeight="semibold"
										className="shrink-0 pt-0.5"
									>
										사유
									</Text>
									<Text
										display="block"
										color={adaptive.red500}
										typography="t6"
										fontWeight="regular"
										className="min-w-0 flex-1"
									>
										{detail.reason}
									</Text>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</BottomSheet>
	);
};
