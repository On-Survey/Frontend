import { adaptive } from "@toss/tds-colors";
import { Top } from "@toss/tds-mobile";
import { Outlet } from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";

function MultipleChoicePage() {
	const { state } = useSurvey();

	const questions = state.survey.question;

	const latestMultipleChoice = questions
		.filter((q) => q.type === "multipleChoice")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestMultipleChoice?.title;

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
						보조설명은 이런식으로 들어갈 것 같아요
					</Top.SubtitleParagraph>
				}
			/>
			<Outlet />
		</div>
	);
}

export default MultipleChoicePage;
