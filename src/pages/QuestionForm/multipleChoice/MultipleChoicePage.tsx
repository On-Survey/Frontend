import { adaptive } from "@toss/tds-colors";
import { Text, Top } from "@toss/tds-mobile";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { formatQuestionNumber } from "../../../utils/questionFactory";
import { useQuestionByType } from "../hooks/useQuestionByType";

export const MultipleChoicePage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const { questionIdFromUrl, title, description, question } =
		useQuestionByType("multipleChoice");

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
					subtitleTop={
						<Text typography="t5" fontWeight="medium" color={adaptive.grey700}>
							{formatQuestionNumber((question?.questionOrder ?? 0) + 1)}
						</Text>
					}
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
							수정하기
						</Top.LowerButton>
					}
				/>
			)}
			<Outlet />
		</div>
	);
};
