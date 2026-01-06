import { generateHapticFeedback } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, Text, useToast } from "@toss/tds-mobile";
import { motion } from "framer-motion";
import { useState } from "react";
import {
	BUTTON_STYLES,
	ICON_PROPS,
	QUESTION_TYPES,
	TEXT_PROPS,
} from "../../../../constants/formController";
import { useSurvey } from "../../../../contexts/SurveyContext";
import { useModal } from "../../../../hooks/UseToggle";
import type { QuestionType } from "../../../../types/survey";
import { QuestionTitleBottomSheet } from "../bottomSheet/QuestionTitleBottomSheet";

interface QuestionControllerProps {
	onPrevious: () => void;
}
export const QuestionController = ({ onPrevious }: QuestionControllerProps) => {
	const { isOpen, handleOpen, handleClose } = useModal();
	const { state } = useSurvey();
	const { openToast } = useToast();
	const [selectedQuestionType, setSelectedQuestionType] =
		useState<QuestionType | null>(null);

	const handlePrevious = () => {
		generateHapticFeedback({ type: "tap" });
		onPrevious();
	};

	const handleQuestionTypeClick = (questionType: string) => {
		if (state.survey.question.length >= 15) {
			openToast("문항은 최대 15개까지 생성이 가능해요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
			return;
		}
		setSelectedQuestionType(questionType as QuestionType);
		handleOpen();
	};

	const handleBottomSheetClose = () => {
		handleClose();
		setSelectedQuestionType(null);
	};

	return (
		<>
			{isOpen && selectedQuestionType && (
				<QuestionTitleBottomSheet
					onClose={handleBottomSheetClose}
					isOpen={isOpen}
					questionType={selectedQuestionType}
				/>
			)}
			<div
				className="flex items-center gap-4 bg-white rounded-full p-2 w-full overflow-x-auto"
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
					WebkitOverflowScrolling: "touch",
				}}
			>
				{/* 뒤로가기 버튼 */}
				<button
					className={BUTTON_STYLES.backButton}
					type="button"
					onClick={handlePrevious}
				>
					<Asset.Icon
						frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
						backgroundColor={ICON_PROPS.backgroundColor}
						name="icon-arrow-left-2-mono"
						color={adaptive.grey600}
						aria-hidden={ICON_PROPS.ariaHidden}
						ratio={ICON_PROPS.ratio}
					/>
				</button>

				{/* 문항 타입 버튼들 */}
				{QUESTION_TYPES.map((questionType, index) => {
					if (index === 0) {
						return (
							<motion.button
								key={questionType.id}
								className={BUTTON_STYLES.questionType}
								type="button"
								onClick={() => handleQuestionTypeClick(questionType.id)}
								initial={{ opacity: 1, x: 60 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.01,
									ease: "linear",
								}}
							>
								<Asset.Icon
									frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
									backgroundColor={ICON_PROPS.backgroundColor}
									name={questionType.icon}
									color={adaptive.grey600}
									aria-hidden={ICON_PROPS.ariaHidden}
									ratio={ICON_PROPS.ratio}
								/>
								<Text
									color={adaptive.grey700}
									typography={TEXT_PROPS.typography}
									fontWeight={TEXT_PROPS.fontWeight}
								>
									{questionType.label}
								</Text>
							</motion.button>
						);
					}

					return (
						<motion.button
							key={questionType.id}
							className={BUTTON_STYLES.questionType}
							type="button"
							onClick={() => handleQuestionTypeClick(questionType.id)}
							initial={{ opacity: 0, scale: 0.85, y: 14 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{
								duration: 0.01,
								ease: "linear",
								delay: index * 0.05,
							}}
						>
							<Asset.Icon
								frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
								backgroundColor={ICON_PROPS.backgroundColor}
								name={questionType.icon}
								color={adaptive.grey600}
								aria-hidden={ICON_PROPS.ariaHidden}
								ratio={ICON_PROPS.ratio}
							/>
							<Text
								color={adaptive.grey700}
								typography={TEXT_PROPS.typography}
								fontWeight={TEXT_PROPS.fontWeight}
							>
								{questionType.label}
							</Text>
						</motion.button>
					);
				})}
			</div>
		</>
	);
};
