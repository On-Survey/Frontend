import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	SegmentedControl,
	Text,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { RatingLabelEditBottomSheete } from "../../components/form/bottomSheet/RatingLabelEditBottomSheete";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";

export const RatingPage = () => {
	const { state } = useSurvey();

	const [isRequired, setIsRequired] = useState(false);
	const [score, setScore] = useState<number | null>(null);
	const [minValue, setMinValue] = useState("내용 입력하기");
	const [maxValue, setMaxValue] = useState("내용 입력하기");

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
		setMinValue(e.target.value);
	};

	const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMaxValue(e.target.value);
	};

	const handleRequiredChange = (checked: boolean) => {
		setIsRequired(checked);
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

	const questions = state.survey.question;

	const latestRating = questions
		.filter((q) => q.type === "rating")
		.sort((a, b) => b.questionOrder - a.questionOrder)[0];
	const title = latestRating?.title;

	return (
		<div>
			<RatingLabelEditBottomSheete
				label="좌측 라벨"
				isOpen={isMinValueEditOpen}
				handleClose={handleMinValueEditClose}
				value={minValue}
				onChange={handleMinValueChange}
			/>
			<RatingLabelEditBottomSheete
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
						문항 설명(선택)
					</Top.SubtitleParagraph>
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
			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</div>
	);
};
