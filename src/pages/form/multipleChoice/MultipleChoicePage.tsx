import { adaptive } from "@toss/tds-colors";
import { Top } from "@toss/tds-mobile";
import { Outlet, useNavigate } from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";

export const MultipleChoicePage = () => {
	const { state } = useSurvey();
	const navigate = useNavigate();

	const questions = state.survey.question;

	const latestMultipleChoice = questions
		.filter((q) => q.type === "multipleChoice")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestMultipleChoice?.title;
	const description = latestMultipleChoice?.description;

	const handleTitleAndDescriptionEdit = () => {
		navigate(`/createForm/multipleChoice/edit`);
	};

	return (
		<div>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						{description || "보조설명은 이런식으로 들어갈 것 같아요"}
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
						onClick={handleTitleAndDescriptionEdit}
					>
						문항 제목 및 설명 수정하기
					</Top.LowerButton>
				}
			/>
			<Outlet />
		</div>
	);
};
