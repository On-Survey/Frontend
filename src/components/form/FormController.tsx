import { generateHapticFeedback } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, ConfirmDialog, Text, useToast } from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
	BUTTON_STYLES,
	ICON_PROPS,
	MAIN_CONTROLS,
	TEXT_PROPS,
} from "../../constants/formController";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { saveQuestions } from "../../service/form";
import { convertQuestionsToServerFormat } from "../../utils/questionConverter";
import { QuestionController } from "./QuestionController";

interface FormControllerProps {
	isReorderMode?: boolean;
	onReorderModeChange?: (isReorderMode: boolean) => void;
}

export const FormController = ({
	isReorderMode = false,
	onReorderModeChange,
}: FormControllerProps) => {
	const hasVisitedControlsRef = useRef(false);
	const { handleStepChange } = useMultiStep();
	const { setScreeningEnabled, state } = useSurvey();

	const [isOpen, setIsOpen] = useState(false);

	const { openToast } = useToast();

	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleSaveAndIsConfirmDialogOpen = async () => {
		generateHapticFeedback({ type: "tap" });
		if (state.survey.question.length === 0) {
			openToast("문항을 추가해주세요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
			return;
		}
		const surveyId = state.surveyId ?? 0;
		const serverQuestions = convertQuestionsToServerFormat(
			state.survey.question,
			surveyId,
		);

		const result = await saveQuestions({
			surveyId,
			questions: {
				questions: serverQuestions,
			},
		});
		if (result.success) {
			handleConfirmDialogOpen();
		}
	};

	const handleOpen = () => {
		generateHapticFeedback({ type: "tap" });
		setIsOpen(true);
	};

	const handleClose = () => {
		generateHapticFeedback({ type: "tap" });
		setIsOpen(false);
	};

	const handleSave = async () => {
		generateHapticFeedback({ type: "tap" });
		if (state.survey.question.length === 0) {
			openToast("문항을 추가해주세요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
			return;
		}
		const surveyId = state.surveyId ?? 0;
		const serverQuestions = convertQuestionsToServerFormat(
			state.survey.question,
			surveyId,
		);

		const result = await saveQuestions({
			surveyId,
			questions: {
				questions: serverQuestions,
			},
		});

		if (result.success) {
			openToast("임시 저장됐어요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
				higherThanCTA: true,
			});
		}
	};

	const handleAddQuestion = () => {
		handleOpen();
	};

	const handleReorderQuestion = () => {
		generateHapticFeedback({ type: "tap" });
		if (state.survey.question.length === 0) {
			openToast("문항을 추가해주세요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
				higherThanCTA: true,
			});
			return;
		}
		if (onReorderModeChange) {
			onReorderModeChange(!isReorderMode);
		}
	};

	const handleNext = () => {
		handleStepChange(2);
	};

	const handleSkip = () => {
		handleStepChange(3);
		handleConfirmDialogClose();
	};

	const handleDialogConfirm = () => {
		setScreeningEnabled(true);
		handleNext();
		handleConfirmDialogClose();
	};

	const handleDialogCancel = () => {
		handleConfirmDialogClose();
	};

	useEffect(() => {
		hasVisitedControlsRef.current = true;
	}, []);

	// 액션 핸들러 매핑
	const actionHandlers = {
		handleSave,
		handleAddQuestion,
		handleReorderQuestion,
	};

	return (
		<AnimatePresence>
			<ConfirmDialog
				key="confirm-dialog"
				open={isConfirmDialogOpen}
				onClose={handleDialogCancel}
				cancelButton={
					<ConfirmDialog.CancelButton size="xlarge" onClick={handleSkip}>
						건너뛰기
					</ConfirmDialog.CancelButton>
				}
				confirmButton={
					<ConfirmDialog.ConfirmButton
						size="xlarge"
						onClick={handleDialogConfirm}
					>
						추가하기
					</ConfirmDialog.ConfirmButton>
				}
				title="스크리닝 질문을 추가할까요?"
				description="스크리닝 질문이란 설문에 참여할 적합한 사람을 미리 선별하기 위한 OX 질문이에요."
			/>
			{isOpen && (
				<div
					key="question-controller-sheet"
					className="fixed bottom-1 left-0 right-0 z-50 bg-gray-100 px-2 pt-2 pb-3"
				>
					<QuestionController onPrevious={handleClose} />
				</div>
			)}

			{!isOpen && (
				<div
					key="main-controls-bar"
					className="fixed bottom-1 left-0 right-0 z-50 bg-gray-100 px-2 pt-2 pb-3"
				>
					<div className="flex items-center gap-2 w-full justify-between">
						<div className="relative flex-1 overflow-hidden h-[60px]">
							<div className="flex items-center gap-2 w-full justify-between">
								<div className="flex items-center gap-10 bg-white rounded-full p-2 w-full justify-center">
									{MAIN_CONTROLS.map((control) => {
										const isReorderControl = control.id === "reorder";
										const displayLabel =
											isReorderControl && isReorderMode
												? "변경 완료"
												: control.label;
										const displayIcon =
											isReorderControl && isReorderMode
												? "icon-check-mono"
												: control.icon;

										if (control.id === "add_question") {
											const shouldAnimateAddButton =
												hasVisitedControlsRef.current;

											return (
												<motion.button
													key={control.id}
													className={BUTTON_STYLES.mainControl}
													onClick={actionHandlers[control.action]}
													type="button"
													initial={
														shouldAnimateAddButton
															? { opacity: 1, x: -60 }
															: false
													}
													animate={{ opacity: 1, x: 0 }}
													transition={
														shouldAnimateAddButton
															? {
																	duration: 0.01,
																	ease: "linear",
																}
															: undefined
													}
												>
													<Asset.Icon
														frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
														backgroundColor={ICON_PROPS.backgroundColor}
														name={displayIcon}
														color={adaptive.grey600}
														aria-hidden={ICON_PROPS.ariaHidden}
														ratio={ICON_PROPS.ratio}
													/>
													<Text
														color={adaptive.grey700}
														typography={TEXT_PROPS.typography}
														fontWeight={TEXT_PROPS.fontWeight}
													>
														{displayLabel}
													</Text>
												</motion.button>
											);
										}

										return (
											<button
												key={control.id}
												className={BUTTON_STYLES.mainControl}
												onClick={actionHandlers[control.action]}
												type="button"
											>
												<Asset.Icon
													frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
													backgroundColor={ICON_PROPS.backgroundColor}
													name={displayIcon}
													color={adaptive.grey600}
													aria-hidden={ICON_PROPS.ariaHidden}
													ratio={ICON_PROPS.ratio}
												/>
												<Text
													color={adaptive.grey700}
													typography={TEXT_PROPS.typography}
													fontWeight={TEXT_PROPS.fontWeight}
												>
													{displayLabel}
												</Text>
											</button>
										);
									})}
								</div>
								<button
									className={BUTTON_STYLES.nextButton}
									type="button"
									onClick={handleSaveAndIsConfirmDialogOpen}
								>
									<Asset.Icon
										frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
										backgroundColor={ICON_PROPS.backgroundColor}
										name="icon-arrow-left-big-mono"
										color={adaptive.background}
										aria-hidden={ICON_PROPS.ariaHidden}
										ratio={ICON_PROPS.ratio}
									/>
									<Text
										color={adaptive.background}
										typography={TEXT_PROPS.typography}
										fontWeight={TEXT_PROPS.fontWeight}
									>
										다음
									</Text>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
};
