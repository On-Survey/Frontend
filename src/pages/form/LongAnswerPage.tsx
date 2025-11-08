import { adaptive } from "@toss/tds-colors";
import {
	Border,
	FixedBottomCTA,
	ListRow,
	Switch,
	TextArea,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";

export const LongAnswerPage = () => {
	const { state } = useSurvey();
	const navigate = useNavigate();

	const [isRequired, setIsRequired] = useState(false);
	const [answer, setAnswer] = useState("");

	const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAnswer(e.target.value);
	};

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
	};

	const handleSubmit = () => {
		console.log("submit");
	};

	const questions = state.survey.question;

	const latestEssay = questions
		.filter((q) => q.type === "longAnswer")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestEssay?.title;
	const description = latestEssay?.description;

	const handleTitleAndDescriptionEdit = () => {
		navigate(`/createForm/essay/edit`);
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
			<TextArea
				variant="box"
				label="장문형 문항"
				labelOption="sustain"
				help="500글자까지 입력할 수 있어요"
				value={answer}
				placeholder="내용을 입력해주세요"
				height={160}
				onChange={handleAnswerChange}
				maxLength={500}
			/>
			<Border variant="padding24" />
			<ListRow
				role="switch"
				aria-checked={true}
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="필수 문항"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				right={
					<Switch
						checked={isRequired}
						onChange={() => handleRequiredChange(!isRequired)}
					/>
				}
				verticalPadding="large"
			/>
			<FixedBottomCTA
				loading={false}
				onClick={handleSubmit}
				disabled={answer.length < 1}
			>
				확인
			</FixedBottomCTA>
		</div>
	);
};
