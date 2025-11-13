import { adaptive } from "@toss/tds-colors";
import { Asset, Button, Text } from "@toss/tds-mobile";

interface UrgentSurveyListProps {
	onViewAll?: () => void;
}

export const UrgentSurveyList = ({ onViewAll }: UrgentSurveyListProps) => {
	return (
		<>
			<div className="px-4 pt-4 pb-3">
				<div className="flex items-center justify-between">
					<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
						마감 임박 설문
					</Text>
					<button type="button" onClick={onViewAll} aria-label="더보기">
						<Text color={adaptive.grey700} typography="t6">
							더보기
						</Text>
					</button>
				</div>
			</div>

			<div className="overflow-x-auto overflow-y-hidden hide-scrollbar px-4">
				<div className="flex gap-3">
					<div className="rounded-2xl p-4 flex-shrink-0 flex flex-col w-[198px] min-h-[166px] opacity-100 bg-gradient-to-b from-gray-100 to-[rgba(254,237,255,1)]">
						<div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-3">
							<Asset.Image
								frameShape={{ width: 20, height: 20 }}
								src="https://static.toss.im/icons/png/4x/icon-clock-pill.png"
								aria-hidden={true}
							/>
						</div>
						<Text
							color={adaptive.grey800}
							typography="t5"
							fontWeight="bold"
							className="mb-2"
						>
							영양제 경험에 대한 설문
						</Text>
						<div className="flex items-center gap-1 mb-3">
							<Asset.Icon
								frameShape={{ width: 16, height: 16 }}
								name="icon-clock-mono"
								color={adaptive.grey400}
								aria-hidden={true}
							/>
							<Text
								color={adaptive.grey800}
								typography="t7"
								fontWeight="semibold"
							>
								마감 하루 전
							</Text>
						</div>
						<div className="flex-1" />
						<Button
							size="small"
							color="dark"
							variant="weak"
							display="block"
							className="mt-auto"
						>
							시작하기
						</Button>
					</div>

					<div className="rounded-2xl p-4 flex-shrink-0 flex flex-col w-[198px] min-w-[198px] min-h-[166px] opacity-100 bg-gradient-to-b from-gray-100 to-[rgba(255,251,236,1)]">
						<div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
							<Asset.Image
								frameShape={{ width: 20, height: 20 }}
								src="https://static.toss.im/icons/png/4x/icon-box-cat-hairpin.png"
								aria-hidden={true}
							/>
						</div>
						<Text
							color={adaptive.grey800}
							typography="t5"
							fontWeight="bold"
							className="mb-2"
						>
							반려동물 외모 경험에 관한 설문
						</Text>
						<div className="flex items-center gap-1 mb-3">
							<Asset.Icon
								frameShape={{ width: 16, height: 16 }}
								name="icon-clock-mono"
								color={adaptive.grey400}
								aria-hidden={true}
							/>
							<Text
								color={adaptive.grey800}
								typography="t7"
								fontWeight="semibold"
							>
								마감 하루 전
							</Text>
						</div>
						<div className="flex-1" />
						<Button
							size="small"
							color="dark"
							variant="weak"
							display="block"
							className="mt-auto"
						>
							시작하기
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
