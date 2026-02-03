import { useSurvey } from "@shared/contexts/SurveyContext";
import { useModal } from "@shared/hooks/UseToggle";
import { pushGtmEvent } from "@shared/lib/gtm";
import { formatQuestionNumber } from "@shared/lib/questionFactory";
import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	List,
	ListRow,
	Switch,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { RatingLabelEditBottomSheet } from "../components/bottomSheet/RatingLabelEditBottomSheete";
import { useQuestionBackHandler } from "../hooks/useQuestionBackHandler";
import { useQuestionByType } from "../hooks/useQuestionByType";
import { useCreateSurveyQuestion } from "../hooks/useQuestionMutations";

export const RatingPage = () => {
	const { state, updateQuestion } = useSurvey();
	const { mutate: createSurveyQuestion } = useCreateSurveyQuestion();
	const location = useLocation();
	const navigate = useNavigate();

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	const {
		question,
		questionId,
		questionIdFromUrl,
		isRequired,
		title,
		description,
	} = useQuestionByType("rating");

	const minValue = question?.minValue ?? "내용 입력하기";
	const maxValue = question?.maxValue ?? "내용 입력하기";
	const ratingCount = question?.rate ?? 10;

	useQuestionBackHandler({ questionId, questionIdFromUrl });

	const {
		isOpen: isMinValueEditOpen,
		handleClose: handleMinValueEditClose,
		handleOpen: handleMinValueEditOpen,
	} = useModal(false);
	const {
		isOpen: isMaxValueEditOpen,
		handleClose: handleMaxValueEditClose,
		handleOpen: handleMaxValueEditOpen,
	} = useModal(false);

	const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (questionId) {
			updateQuestion(questionId, {
				minValue: e.target.value,
			});
		}
	};

	const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (questionId) {
			updateQuestion(questionId, {
				maxValue: e.target.value,
			});
		}
	};

	const handleRequiredChange = (checked: boolean) => {
		if (questionId) {
			updateQuestion(questionId, {
				isRequired: checked,
			});
		}
	};

	const handlePlusClick = () => {
		if (questionId && ratingCount < 10) {
			updateQuestion(questionId, {
				rate: ratingCount + 1,
			});
		}
	};

	const handleMinusClick = () => {
		if (questionId && ratingCount > 2) {
			updateQuestion(questionId, {
				rate: ratingCount - 1,
			});
		}
	};

	const handleTitleAndDescriptionEdit = () => {
		if (questionIdFromUrl) {
			navigate(`/createForm/rating/edit?questionId=${questionIdFromUrl}`);
		} else {
			navigate(`/createForm/rating/edit`);
		}
	};

	const handleConfirm = () => {
		if (questionIdFromUrl) {
			navigate(-1);
			return;
		}

		createSurveyQuestion(
			{
				surveyId: state.surveyId ?? 0,
				questionInfo: {
					questionType: "RATING",
					title: title ?? "",
					description: description ?? "",
					questionOrder: question?.questionOrder ?? 0,
				},
			},
			{
				onSuccess: (result) => {
					if (result.success && typeof result !== "string") {
						if (questionId) {
							updateQuestion(questionId, {
								questionId: result.result.questionId,
							});
						}

						const source = locationState?.source ?? "main_cta";
						const status =
							source === "main_cta" || source === "mysurvey_button"
								? "draft"
								: "editing";
						const questionIndex = (question?.questionOrder ?? 0) + 1;

						pushGtmEvent({
							event: "survey_question_add",
							pagePath: "/createForm",
							source,
							step: "question",
							status,
							...(state.surveyId && { survey_id: String(state.surveyId) }),
							question_type: "rating",
							question_index: String(questionIndex),
						});

						navigate(-1);
					}
				},
				onError: (error) => {
					console.error("질문 생성 실패:", error);
				},
			},
		);
	};

	return (
		<div>
			<RatingLabelEditBottomSheet
				label="좌측 라벨"
				isOpen={isMinValueEditOpen}
				handleClose={handleMinValueEditClose}
				value={minValue}
				onChange={handleMinValueChange}
			/>
			<RatingLabelEditBottomSheet
				label="우측 라벨"
				isOpen={isMaxValueEditOpen}
				handleClose={handleMaxValueEditClose}
				value={maxValue}
				onChange={handleMaxValueChange}
			/>
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
					<Top.SubtitleParagraph size={15}>
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

			<div className="flex gap-1 mt-20 w-full justify-between px-4">
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW24}
					backgroundColor="transparent"
					name="icon-minus-circle-mono"
					color={ratingCount <= 2 ? adaptive.grey200 : adaptive.grey400}
					aria-hidden={true}
					ratio="1/1"
					onClick={handleMinusClick}
				/>

				<div className="flex gap-1.5 flex-1 justify-center ">
					{Array.from({ length: ratingCount }, (_, idx) => {
						const v = idx + 1;
						return (
							<div key={v} className="w-6 h-6 rounded-full bg-gray-100"></div>
						);
					})}
				</div>
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW24}
					backgroundColor="transparent"
					name="icon-plus-circle-mono"
					color={ratingCount >= 10 ? adaptive.grey200 : adaptive.grey400}
					aria-hidden={true}
					ratio="1/1"
					onClick={handlePlusClick}
				/>
			</div>
			<div className="mt-2 flex justify-between items-center px-4.5">
				<button type="button" onClick={handleMinValueEditOpen}>
					<Text typography="t5" fontWeight="medium" color={adaptive.grey400}>
						{minValue}
					</Text>
				</button>
				<button type="button" onClick={handleMaxValueEditOpen}>
					<Text typography="t5" fontWeight="medium" color={adaptive.grey400}>
						{maxValue}
					</Text>
				</button>
			</div>

			<div className="mt-8">
				<List>
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
							<Switch
								checked={isRequired}
								onChange={() => handleRequiredChange(!isRequired)}
							/>
						}
						verticalPadding="large"
					/>
				</List>
			</div>
			<FixedBottomCTA
				loading={false}
				onClick={handleConfirm}
				style={
					{ "--button-background-color": "#15c67f" } as React.CSSProperties
				}
			>
				확인
			</FixedBottomCTA>
		</div>
	);
};
