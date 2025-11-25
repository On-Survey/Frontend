import { adaptive } from "@toss/tds-colors";
import { Top } from "@toss/tds-mobile";
import {
	Outlet,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { useSurvey } from "../../../contexts/SurveyContext";

export const MultipleChoicePage = () => {
	const { state } = useSurvey();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;

	const targetMultipleChoice = questionIdFromUrl
		? questions.find(
				(q) =>
					q.questionId.toString() === questionIdFromUrl &&
					q.type === "multipleChoice",
			)
		: questions
				.filter((q) => q.type === "multipleChoice")
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const title = targetMultipleChoice?.title;
	const description = targetMultipleChoice?.description;

	const handleTitleAndDescriptionEdit = () => {
		if (questionIdFromUrl) {
			navigate(
				`/createForm/multipleChoice/edit?questionId=${questionIdFromUrl}`,
			);
		} else {
			navigate(`/createForm/multipleChoice/edit`);
		}
	};

	const isQuestionOptionsPage = /\/questions\/\d+$/.test(location.pathname);

	return (
		<div>
			{!isQuestionOptionsPage && (
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
			)}
			<Outlet />
		</div>
	);
};
