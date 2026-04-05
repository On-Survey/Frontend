import { adaptive } from "@toss/tds-colors";
import { Asset, TextButton } from "@toss/tds-mobile";

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
		<div className="mt-6 grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-[#E5E8EB] px-6 pt-4 pb-1">
			<div className="flex min-w-0 justify-start">
				{activeSectionIndex > 0 ? (
					<TextButton
						type="button"
						variant="clear"
						size="medium"
						color={adaptive.grey700}
						typography="t6"
						fontWeight="medium"
						css={{ justifyContent: "flex-start" }}
						className="p-0!"
						onClick={() => onNavigateToSection(activeSectionIndex - 1)}
					>
						<span className="inline-flex items-center gap-1">
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW20}
								backgroundColor="transparent"
								name="arrow-rightwards"
								color={adaptive.grey700}
								aria-hidden={true}
								ratio="1/1"
								className="shrink-0 scale-x-[-1]"
							/>
							{`섹션 ${getSectionDisplayNumber(activeSectionIndex - 1)} 이동`}
						</span>
					</TextButton>
				) : null}
			</div>
			<div aria-hidden={true} />
			<div className="flex min-w-0 justify-end">
				{activeSectionIndex < sectionCount - 1 ? (
					<TextButton
						type="button"
						variant="arrow"
						size="medium"
						arrowPlacement="inline"
						color={adaptive.grey700}
						typography="t6"
						fontWeight="medium"
						css={{ justifyContent: "flex-end" }}
						className="p-0!"
						onClick={() => onNavigateToSection(activeSectionIndex + 1)}
					>
						{`섹션 ${getSectionDisplayNumber(activeSectionIndex + 1)} 이동`}
					</TextButton>
				) : null}
			</div>
		</div>
	);
};
