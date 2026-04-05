import type { FormRequestValidationDetail } from "@features/google-form-conversion/service/api";
import { TextWithLinks } from "@features/survey/components/TextWithLinks";
import { adaptive } from "@toss/tds-colors";
import { Asset, ListHeader, Text } from "@toss/tds-mobile";

/** 미리보기 문항 ID와 겹치지 않게 펼침 상태용 ID (양수) */
export const PREVIEW_INCONVERTIBLE_EXPAND_ID_BASE = 9_000_000;

export type PreviewInconvertibleSectionRowProps = {
	detail: FormRequestValidationDetail;
	isExpanded: boolean;
	onToggleExpand: () => void;
};

export const PreviewInconvertibleSectionRow = ({
	detail,
	isExpanded,
	onToggleExpand,
}: PreviewInconvertibleSectionRowProps) => {
	const titleText = detail.title?.trim() ? detail.title : "(제목 없음)";
	const requiredLabel = detail.isRequired === true ? "필수" : "선택";
	const conversionErrorMessage =
		detail.reason?.trim() || "문항을 변환할 수 없습니다.";

	return (
		<>
			<ListHeader
				descriptionPosition="top"
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						<TextWithLinks text={titleText} variant="inline" inheritLinkSize />
					</ListHeader.TitleParagraph>
				}
				description={
					<ListHeader.DescriptionParagraph>
						{requiredLabel}
					</ListHeader.DescriptionParagraph>
				}
				right={
					<div style={{ marginRight: "20px" }}>
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW24}
							name={isExpanded ? "icon-arrow-up-mono" : "icon-arrow-down-mono"}
							color={adaptive.grey600}
							aria-label={isExpanded ? "접기" : "펼치기"}
							onClick={onToggleExpand}
						/>
					</div>
				}
			/>
			{isExpanded ? (
				<div className="flex items-start gap-2 px-6 pb-4">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW16}
						backgroundColor="transparent"
						name="icon-warning-circle-red-opacity"
						aria-hidden={true}
						ratio="1/1"
						className="mt-0.5 shrink-0"
					/>
					<Text
						display="block"
						color={adaptive.red400}
						typography="t7"
						fontWeight="medium"
						className="min-w-0 flex-1"
					>
						{conversionErrorMessage}
					</Text>
				</div>
			) : null}
		</>
	);
};
