import { adaptive } from "@toss/tds-colors";
import { TextButton } from "@toss/tds-mobile";

export type PreviewSectionNavBarProps = {
	sectionCount: number;
	activeSectionIndex: number;
	getSectionDisplayNumber: (sectionIndex: number) => number;
	onNavigateToSection: (sectionIndex: number) => void;
};

export const PreviewSectionNavBar = ({
	sectionCount,
	activeSectionIndex,
	getSectionDisplayNumber,
	onNavigateToSection,
}: PreviewSectionNavBarProps) => {
	if (sectionCount <= 1) return null;

	return (
		<div className="flex w-full items-center justify-between gap-3 border-b border-[#E5E8EB] px-6 py-2.5">
			<div className="flex min-w-0 flex-1 justify-start">
				{activeSectionIndex > 0 ? (
					<TextButton
						type="button"
						variant="arrow"
						size="medium"
						arrowPlacement="inline"
						color={adaptive.grey700}
						typography="t6"
						fontWeight="medium"
						css={{ flexDirection: "row-reverse" }}
						onClick={() => onNavigateToSection(activeSectionIndex - 1)}
					>
						{`섹션 ${getSectionDisplayNumber(activeSectionIndex - 1)} 이동`}
					</TextButton>
				) : null}
			</div>
			<div className="flex min-w-0 flex-1 justify-end">
				{activeSectionIndex < sectionCount - 1 ? (
					<TextButton
						type="button"
						variant="arrow"
						size="medium"
						arrowPlacement="inline"
						color={adaptive.grey700}
						typography="t6"
						fontWeight="medium"
						onClick={() => onNavigateToSection(activeSectionIndex + 1)}
					>
						{`섹션 ${getSectionDisplayNumber(activeSectionIndex + 1)} 이동`}
					</TextButton>
				) : null}
			</div>
		</div>
	);
};
