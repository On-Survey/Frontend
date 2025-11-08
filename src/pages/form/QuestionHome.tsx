import { adaptive } from "@toss/tds-colors";
import { Border, IconButton, Text, Top } from "@toss/tds-mobile";
import { FormController } from "../../components/form/FormController";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import {
	formatQuestionNumber,
	getQuestionTypeLabel,
} from "../../utils/questionFactory";

export const QuestionHome = () => {
	const { state } = useSurvey();
	const { handleStepChange } = useMultiStep();

	const handlePrevious = () => {
		handleStepChange(0);
	};

	// 문항들을 questionOrder 순서로 정렬
	const sortedQuestions = [...state.survey.question].sort(
		(a, b) => a.questionOrder - b.questionOrder,
	);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{state.survey.title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						{state.survey.description}
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
						onClick={handlePrevious}
					>
						시작 정보 수정하기
					</Top.LowerButton>
				}
			/>
			<Border variant="height16" />
			<div className="h-3" />
			{sortedQuestions.map((question) => (
				<div key={question.questionId} className="px-4 mb-6">
					<div className="flex justify-between items-start gap-1">
						<Text
							display="block"
							color={adaptive.grey800}
							typography="t6"
							fontWeight="semibold"
							textAlign="center"
							className="w-10"
						>
							{formatQuestionNumber(question.questionOrder + 1)}
						</Text>
						<Text
							display="block"
							color={adaptive.grey700}
							typography="t6"
							fontWeight="semibold"
						>
							{question.title}
						</Text>
						<IconButton
							src="https://static.toss.im/icons/png/4x/icon-fill-three-dots-mono.png"
							variant="clear"
							color={adaptive.grey600}
							aria-label="더보기"
						/>
					</div>
					<div className="h-4" />
					<div className="flex items-center gap-1 pl-8">
						<Text color={adaptive.grey600} typography="t7" fontWeight="medium">
							{question.isRequired ? "필수" : "선택"}
						</Text>
						<Text color={adaptive.grey600} typography="t7" fontWeight="medium">
							·
						</Text>
						<Text color={adaptive.grey600} typography="t7" fontWeight="medium">
							{getQuestionTypeLabel(question.type)}
						</Text>
					</div>
				</div>
			))}
			<FormController />
		</>
	);
};
