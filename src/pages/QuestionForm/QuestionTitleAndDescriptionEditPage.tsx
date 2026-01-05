import { FixedBottomCTA, TextArea } from "@toss/tds-mobile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";

export const QuestionTitleAndDescriptionEditPage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;

	const targetQuestion = questionIdFromUrl
		? questions.find((q) => q.questionId.toString() === questionIdFromUrl)
		: questions.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const title = targetQuestion?.title;
	const description = targetQuestion?.description;

	const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateQuestion(targetQuestion?.questionId.toString() || "", {
			title: e.target.value,
		});
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		updateQuestion(targetQuestion?.questionId.toString() || "", {
			description: e.target.value,
		});
	};

	const handleComplete = () => {
		navigate(-1);
	};

	return (
		<>
			<div className="mt-4" />
			<TextArea
				variant="line"
				hasError={false}
				label="문항 제목"
				value={title}
				placeholder="문항 제목"
				autoFocus={true}
				onChange={handleTitleChange}
			/>

			<TextArea
				variant="line"
				hasError={false}
				label="설명"
				value={description}
				placeholder="설명"
				onChange={handleDescriptionChange}
			/>
			<FixedBottomCTA
				loading={false}
				onClick={handleComplete}
				disabled={!title}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				완료
			</FixedBottomCTA>
		</>
	);
};
