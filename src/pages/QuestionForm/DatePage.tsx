import { adaptive } from "@toss/tds-colors";
import {
	FixedBottomCTA,
	ListRow,
	Switch,
	Top,
	WheelDatePicker,
} from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { createSurveyQuestion } from "../../service/form";
import { useQuestionByType } from "./hooks/useQuestionByType";

export const DatePage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();

	const {
		question,
		questionId,
		questionIdFromUrl,
		isRequired,
		title,
		description,
	} = useQuestionByType("date");

	const date = question?.date;

	const handleDateChange = (newDate: Date) => {
		if (questionId) {
			updateQuestion(questionId, {
				date: newDate,
			});
		}
	};

	const handleIsRequiredChange = () => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: !isRequired,
			});
		}
	};

	const handleTitleAndDescriptionEdit = () => {
		if (questionIdFromUrl) {
			navigate(`/createForm/date/edit?questionId=${questionIdFromUrl}`);
		} else {
			navigate(`/createForm/date/edit`);
		}
	};

	const handleSubmit = async () => {
		if (!questionId) {
			return;
		}

		const result = await createSurveyQuestion({
			surveyId: state.surveyId ?? 0,
			questionInfo: {
				questionType: "DATE",
				title: title ?? "",
				description: description ?? "",
				questionOrder: question?.questionOrder ?? 0,
			},
		});

		if (result.success && typeof result !== "string") {
			updateQuestion(questionId, {
				questionId: result.result.questionId,
			});

			navigate(-1);
		}
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

			<WheelDatePicker
				title={"날짜를 선택해 주세요"}
				value={date}
				onChange={handleDateChange}
				triggerLabel={"날짜"}
				buttonText={"선택하기"}
			/>
			<ListRow
				role="switch"
				aria-checked={isRequired}
				contents={
					<ListRow.Texts
						type="1RowTypeA"
						top="필수 문항"
						topProps={{ color: adaptive.grey700 }}
					/>
				}
				right={
					<Switch checked={isRequired} onChange={handleIsRequiredChange} />
				}
				verticalPadding="large"
			/>
			<FixedBottomCTA loading={false} onClick={handleSubmit}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
