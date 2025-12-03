import { adaptive } from "@toss/tds-colors";
import { Top } from "@toss/tds-mobile";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuestionByType } from "../hooks/useQuestionByType";

export const MultipleChoicePage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const { questionIdFromUrl, title, description } =
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
