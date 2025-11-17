import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	SegmentedControl,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RatingLabelEditBottomSheet } from "../../components/form/bottomSheet/RatingLabelEditBottomSheete";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { createSurveyQuestion } from "../../service/form";
import { isRatingQuestion } from "../../types/survey";

export const RatingPage = () => {
	const { state, updateQuestion } = useSurvey();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const questionIdFromUrl = searchParams.get("questionId");

	const questions = state.survey.question;
	const targetQuestion = questionIdFromUrl
		? questions.find(
				(q) =>
					q.questionId.toString() === questionIdFromUrl && q.type === "rating",
			)
		: questions
				.filter((q) => q.type === "rating")
				.sort((a, b) => b.questionOrder - a.questionOrder)[0];

	const question = isRatingQuestion(targetQuestion)
		? targetQuestion
		: undefined;

	const questionId = question?.questionId.toString();
	const isRequired = question?.isRequired ?? false;
	const minValue = question?.minValue ?? "내용 입력하기";
	const maxValue = question?.maxValue ?? "내용 입력하기";
	const [score, setScore] = useState<number | null>(null);

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
		if (score === null) {
			setScore(1);
		} else {
			setScore(score + 1);
		}
	};

	const handleMinusClick = () => {
		if (score === null) {
			setScore(1);
		} else {
			setScore(score - 1);
		}
	};

	const title = question?.title;
	const description = question?.description;

	const handleTitleAndDescriptionEdit = () => {
		navigate(`/createForm/rating/edit`);
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
			},
		});

		if (result.success && typeof result.result !== "string") {
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
			<SegmentedControl
				alignment="fixed"
				value={isRequired ? "1-선택" : "0-필수"}
				disabled={false}
				size="large"
				name="SegmentedControl"
				onChange={(v) => handleRequiredChange(v === "1-선택")}
			>
				<SegmentedControl.Item value="0-필수">필수</SegmentedControl.Item>
				<SegmentedControl.Item value="1-선택">선택</SegmentedControl.Item>
			</SegmentedControl>

			<div className="flex gap-1 mt-20 w-full justify-between px-3">
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW24}
					backgroundColor="transparent"
					name="icon-minus-circle-mono"
					color={adaptive.grey400}
					aria-hidden={true}
					ratio="1/1"
					onClick={handleMinusClick}
				/>

				<div className="flex gap-1.5 flex-1 justify-center">
					{Array.from({ length: 10 }, (_, idx) => {
						const v = idx + 1;
						const isActive = score !== null && v <= score;
						return (
							<button
								type="button"
								key={v}
								className={`w-6 h-6 rounded-full ${isActive ? "bg-blue-400" : "bg-gray-100"} rounded-full!`}
								aria-label={`$v점`}
								onClick={() => setScore(v)}
							></button>
						);
					})}
				</div>
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW24}
					backgroundColor="transparent"
					name="icon-plus-circle-mono"
					color={adaptive.grey400}
					aria-hidden={true}
					ratio="1/1"
					onClick={handlePlusClick}
				/>
			</div>
			<div className="mt-2 flex justify-between items-center px-3">
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
			<FixedBottomCTA loading={false} onClick={handleConfirm}>
				확인
			</FixedBottomCTA>
		</div>
	);
};
