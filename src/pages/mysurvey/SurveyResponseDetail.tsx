import { adaptive } from "@toss/tds-colors";
import { Asset, Button, List, ListRow, Top } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomNavigation } from "../../components/BottomNavigation";
import {
	QUESTION_TYPE_LABELS,
	SURVEY_BADGE_CONFIG,
	SURVEY_STATUS_LABELS,
} from "../../constants/survey";
import type { SurveyResponseDetail as SurveyResponseDetailType } from "../../types/surveyResponse";
import { SurveyFilterBottomSheet } from "./components/SurveyFilterBottomSheet";

export const SurveyResponseDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// Mock
	const surveyResponse: SurveyResponseDetailType = {
		id: Number(id) || 1,
		title: "반려동물 외모 취향에 관한 설문",
		status: "active",
		responseCount: 11,
		questions: [
			{
				id: "1",
				title: "키우고 계신 견종이 무엇입니까?",
				type: "shortAnswer",
				required: true,
				responseCount: 11,
			},
			{
				id: "2",
				title: "해당 견종을 왜 키우고 계신가요?",
				type: "longAnswer",
				required: true,
				responseCount: 10,
			},
		],
	};

	const badge = SURVEY_BADGE_CONFIG[surveyResponse.status];

	const handleMyPage = () => {
		navigate("/mypage");
	};

	const getQuestionTypeLabel = (type: string, required: boolean) => {
		const requiredLabel = required ? "필수" : "선택";
		const typeLabel = QUESTION_TYPE_LABELS[type] || type;
		return `${requiredLabel} / ${typeLabel}`;
	};

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{surveyResponse.title}
					</Top.TitleParagraph>
				}
				subtitleTop={
					<Top.SubtitleBadges
						badges={[
							{
								text: SURVEY_STATUS_LABELS[surveyResponse.status],
								color: badge.color,
								variant: "weak",
							},
						]}
					/>
				}
				subtitleBottom={
					<Top.SubtitleParagraph size={15}>
						{surveyResponse.responseCount}명 응답
					</Top.SubtitleParagraph>
				}
			/>
			<div className="h-4" />

			<div className="flex-1 overflow-y-auto pb-24">
				<List>
					<ListRow
						contents={
							<ListRow.Texts
								type="2RowTypeC"
								top="설문 질문"
								topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
								bottom=""
								bottomProps={{ color: adaptive.grey500 }}
							/>
						}
						right={
							<button
								type="button"
								onClick={() => setIsFilterOpen(true)}
								aria-label="필터 열기"
							>
								<Asset.Icon
									frameShape={{ width: 18, height: 18 }}
									name="icon-filter-mono"
									color={adaptive.grey600}
									aria-hidden={true}
								/>
							</button>
						}
						verticalPadding="small"
						horizontalPadding="small"
					/>
					{surveyResponse.questions.map((question) => (
						<ListRow
							key={question.id}
							contents={
								<ListRow.Texts
									type="2RowTypeA"
									top={`${parseInt(question.id, 10)}. ${question.title}`}
									topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
									bottom={getQuestionTypeLabel(
										question.type,
										question.required,
									)}
									bottomProps={{ color: adaptive.grey600 }}
								/>
							}
							right={
								<Button size="medium" variant="weak">
									{question.responseCount}명
								</Button>
							}
							verticalPadding="large"
						/>
					))}
				</List>
			</div>

			<BottomNavigation currentPage="more" onMoreClick={handleMyPage} />
			<SurveyFilterBottomSheet
				open={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
			/>
		</div>
	);
};
