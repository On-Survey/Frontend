import { IneligibleSurveyBottomSheet } from "@features/screening/components/IneligibleSurveyBottomSheet";
import { topics } from "@shared/constants/topics";
import { pushGtmEvent } from "@shared/lib/gtm";
import type { SurveyListItem } from "@shared/types/surveyList";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	Border,
	Checkbox,
	ListHeader,
	ListRow,
	Spacing,
	Text,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CustomSurveyListProps {
	surveys: SurveyListItem[];
	userName?: string;
	viewAllPath?: string;
}

export const CustomSurveyList = ({ surveys }: CustomSurveyListProps) => {
	const navigate = useNavigate();
	const [showOnlyEligible, setShowOnlyEligible] = useState(false);
	const [isIneligibleBottomSheetOpen, setIsIneligibleBottomSheetOpen] =
		useState(false);

	const handleSurveyClick = (survey: SurveyListItem) => {
		const surveyWithInfo = survey as SurveyListItem & {
			hasScreening?: boolean;
			isEligible?: boolean;
		};
		const hasScreening = surveyWithInfo.hasScreening ?? false;
		const isEligible = surveyWithInfo.isEligible ?? false;

		// 1.1, 1.3: 세그먼트가 존재하는 설문의 경우 - 세그먼트가 맞지 않으면 참여 불가
		if (!isEligible) {
			setIsIneligibleBottomSheetOpen(true);
			return;
		}

		// 1.3: 세그먼트가 존재하며, 스크리닝이 존재하는 경우 - 세그먼트가 맞으면 스크리닝 노출
		if (hasScreening && isEligible) {
			navigate(`/oxScreening?surveyId=${survey.id}`);
			return;
		}

		// 1.2, 1.4: 세그먼트가 없거나, 세그먼트가 있지만 스크리닝이 없는 경우 - 설문 페이지로 이동
		pushGtmEvent({
			event: "survey_start",
			pagePath: "/survey",
			survey_id: String(survey.id),
			source: "main",
		});
		const searchParams = new URLSearchParams({ surveyId: survey.id });
		navigate(
			{
				pathname: "/survey",
				search: `?${searchParams.toString()}`,
			},
			{ state: { surveyId: survey.id, survey } },
		);
	};

	// 필터링된 설문 목록
	const filteredSurveys = showOnlyEligible
		? surveys.filter((survey) => {
				const surveyWithInfo = survey as SurveyListItem & {
					hasScreening?: boolean;
					isEligible?: boolean;
				};

				// 참여 가능한 설문만 필터링
				// 스크리닝이 없거나, 세그먼트가 맞는 경우
				const hasScreening = surveyWithInfo.hasScreening ?? false;
				const isEligible = surveyWithInfo.isEligible ?? true; // 기본값은 true (recommended에 포함된 설문은 참여 가능)

				// 스크리닝이 없거나, 세그먼트가 맞는 경우 참여 가능
				return !hasScreening || isEligible;
			})
		: surveys; // 필터가 꺼져있으면 모든 설문 표시

	return (
		<>
			<ListHeader
				title={
					<ListHeader.TitleParagraph
						color={adaptive.grey800}
						fontWeight="bold"
						typography="t4"
					>
						지금 열려있는 설문
					</ListHeader.TitleParagraph>
				}
			/>
			<ListRow
				role="checkbox"
				aria-checked={showOnlyEligible}
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="참여 가능한 설문만"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				right={
					<Checkbox.Circle
						size={20}
						checked={showOnlyEligible}
						onChange={(e) => setShowOnlyEligible(e.target.checked)}
					/>
				}
				onClick={() => setShowOnlyEligible(!showOnlyEligible)}
				verticalPadding="small"
			/>
			<Border variant="padding24" />
			<Spacing size={21} />

			{filteredSurveys.map((survey) => {
				// 스크리닝 정보 확인
				const surveyWithInfo = survey as SurveyListItem & {
					hasScreening?: boolean;
					isEligible?: boolean;
				};
				const hasScreening = surveyWithInfo.hasScreening ?? false;
				const isEligible = surveyWithInfo.isEligible ?? true;

				// interest(topicId) 기반으로 아이콘 가져오기
				const topic = topics.find((t) => t.id === survey.topicId);
				const icon = topic?.icon;

				// 설문 상태 결정
				let statusText = "";
				let statusColor = adaptive.grey500;
				let statusIcon: React.ReactNode = null;

				if (!isEligible) {
					// 세그먼트가 맞지 않는 경우 (스크리닝 여부와 관계없이)
					statusText = "설문 설정 조건에 따라 참여가 제한돼요";
					statusColor = adaptive.red400;
					statusIcon = (
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW16}
							backgroundColor="transparent"
							name="icon-warning-circle-red-opacity"
							aria-hidden={true}
							ratio="1/1"
						/>
					);
				} else if (hasScreening) {
					// 세그먼트 일치 + 스크리닝이 있는 경우
					statusText = "설문 참여를 위한 간단한 질문이 있어요";
					statusColor = adaptive.grey500;
					statusIcon = (
						<Asset.Icon
							frameShape={Asset.frameShape.CleanW20}
							backgroundColor="transparent"
							name="icon-o-x-quiz-mono"
							color={adaptive.grey600}
							aria-hidden={true}
							ratio="1/1"
						/>
					);
				} else {
					// 세그먼트 일치 + 스크리닝이 없는 경우
					statusText = "누구나 참여 가능해요";
					statusColor = adaptive.grey500;
				}

				return (
					<div key={survey.id} className="px-4 pb-4">
						<button
							type="button"
							className="flex items-start gap-3 w-full text-left"
							onClick={() => handleSurveyClick(survey)}
							style={{ background: "none", border: "none", padding: 0 }}
						>
							{icon?.type === "image" && icon.src ? (
								<div
									className="flex items-center justify-center"
									style={{
										width: "48px",
										height: "48px",
										borderRadius: "50%",
										backgroundColor: adaptive.greyOpacity100,
									}}
								>
									<Asset.Image
										frameShape={Asset.frameShape.CleanW24}
										backgroundColor="transparent"
										src={icon.src}
										aria-hidden={true}
										style={{ aspectRatio: "1/1" }}
									/>
								</div>
							) : (
								<Asset.Icon
									frameShape={Asset.frameShape.CircleLarge}
									backgroundColor={adaptive.greyOpacity100}
									name={icon?.name || survey.iconName || "icon-box-cat-grey"}
									scale={0.66}
									aria-hidden={true}
								/>
							)}
							<div className="flex-1 flex flex-col gap-1">
								<Text
									color={adaptive.grey700}
									typography="t5"
									fontWeight="bold"
								>
									{survey.title}
								</Text>
								<div className="flex items-center gap-1">
									{statusIcon}
									<Text color={statusColor} typography="t7" fontWeight="medium">
										{statusText}
									</Text>
								</div>
							</div>
							{!survey.isFree && (
								<div
									style={{
										width: "fit-content",
										height: "fit-content",
										borderRadius: "4px",
										opacity: 1,
										backgroundColor: "#FFF9EF",
										backdropFilter: "blur(0px)",
										padding: "4px 8px",
									}}
								>
									<Text
										style={{
											fontSize: "14px",
											fontWeight: "semibold",
											color: "#DD7D02",
										}}
									>
										200원
									</Text>
								</div>
							)}
						</button>
					</div>
				);
			})}

			{/* 참여 불가 바텀시트 */}
			<IneligibleSurveyBottomSheet
				open={isIneligibleBottomSheetOpen}
				onClose={() => setIsIneligibleBottomSheetOpen(false)}
			/>
		</>
	);
};
