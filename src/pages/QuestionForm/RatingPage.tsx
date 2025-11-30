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
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { createSurveyQuestion } from "./api";
import { RatingLabelEditBottomSheet } from "./components/bottomSheet/RatingLabelEditBottomSheete";
import { useQuestionByType } from "./hooks/useQuestionByType";

export const RatingPage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();

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

	const handleConfirm = async () => {
		if (!questionId) {
			return;
		}

		const result = await createSurveyQuestion({
			surveyId: state.surveyId ?? 0,
			questionInfo: {
				questionType: "RATING",
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
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{title}
					</Top.TitleParagraph>
				}
				subtitleTop={<Top.SubtitleBadges badges={[]} />}
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
						문항 제목 및 설명 수정하기
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
			<FixedBottomCTA loading={false} onClick={handleConfirm}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
