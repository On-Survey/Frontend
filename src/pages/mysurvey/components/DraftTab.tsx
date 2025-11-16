import { colors } from "@toss/tds-colors";
import { Text, useToast } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { getWritingSurvey } from "../../../service/mysurvey/api";
import { SurveyCard } from "./SurveyCard";
import type { DraftSurvey } from "./types";

interface DraftTabProps {
	surveys: DraftSurvey[];
}

export const DraftTab = ({ surveys }: DraftTabProps) => {
	const navigate = useNavigate();
	const { openToast } = useToast();

	const handleDraftClick = async (surveyId: number) => {
		try {
			const data = await getWritingSurvey(surveyId);
			// 간단 확인 토스트 및 작성 페이지로 이동 (필요 시 상태/파라미터 전달)
			openToast(`문항 ${data.questions.length}개 불러왔어요.`, {
				type: "bottom",
				higherThanCTA: true,
			});
			// 편집 페이지로 라우팅 (추후 편집 페이지가 정해지면 경로/파라미터 조정)
			navigate(`/createFormStart?s=${surveyId}`);
		} catch (error) {
			openToast("작성 중인 설문을 불러오지 못했어요.", {
				type: "bottom",
				higherThanCTA: true,
			});
			console.error("작성 중 설문 조회 실패:", error);
		}
	};

	if (surveys.length === 0) {
		return (
			<Text color={colors.grey700} typography="t7">
				작성 중인 설문이 없습니다.
			</Text>
		);
	}

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<SurveyCard
					key={survey.id}
					survey={survey}
					type="draft"
					onClick={handleDraftClick}
				/>
			))}
		</div>
	);
};
