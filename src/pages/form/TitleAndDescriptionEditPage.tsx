import { FixedBottomCTA, TextArea } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";

export const TitleAndDescriptionEditPage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();

	const questions = state.survey.question;

	const latestQuestion = questions.sort(
		(a, b) => b.questionOrder - a.questionOrder,
	)[0];
	const title = latestQuestion?.title;
	const description = latestQuestion?.description;

	const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateQuestion(latestQuestion?.questionId.toString() || "", {
			title: e.target.value,
		});
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		updateQuestion(latestQuestion?.questionId.toString() || "", {
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
			>
				완료
			</FixedBottomCTA>
		</>
	);
};
